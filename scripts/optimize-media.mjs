import { execFileSync } from 'node:child_process';
import { mkdir, rm, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const sourceRoot = join(root, 'assets-source', 'Team Assets');
const outputRoot = join(root, 'public', 'media');
const widths = [640, 960, 1440];

const images = [
  ['Team photo.JPG', 'team-gathering'],
  ['Team Photo 2.JPG', 'team-social-gathering'],
  ['Team Photo 3.JPG', 'team-meeting'],
  ['Team Photo 4.jpg', 'team-outdoor-activity'],
  ['Achievement.jpg', 'promotion-stage-photo'],
  ['Achievement 2.JPG', 'certificate-group-photo'],
  ['Testimonial.jpg', 'manager-promotion-graphic'],
];

async function writeResponsiveImage(sourceName, outputName) {
  const input = join(sourceRoot, sourceName);

  for (const width of widths) {
    const resized = sharp(input).rotate().resize({ width, withoutEnlargement: false });
    await resized.clone().webp({ quality: 78, effort: 6 }).toFile(join(outputRoot, `${outputName}-${width}.webp`));
    await resized.clone().avif({ quality: 52, effort: 6 }).toFile(join(outputRoot, `${outputName}-${width}.avif`));
  }
}

async function optimizeLogo() {
  const input = join(sourceRoot, 'Logo.png');
  await sharp(input).png({ compressionLevel: 9, palette: true }).toFile(join(outputRoot, 'coway-logo.png'));
  await sharp(input).webp({ lossless: true, effort: 6 }).toFile(join(outputRoot, 'coway-logo.webp'));
  await sharp(input).avif({ lossless: true, effort: 6 }).toFile(join(outputRoot, 'coway-logo.avif'));
}

function resolveFfmpeg() {
  const configured = process.env.FFMPEG_PATH?.trim().replace(/^"(.*)"$/, '$1');
  return configured
    || 'C:\\Users\\CH\\AppData\\Local\\ms-playwright\\ffmpeg-1011\\ffmpeg-win64.exe';
}

async function optimizeVideo() {
  const ffmpeg = resolveFfmpeg();
  const formats = execFileSync(ffmpeg, ['-hide_banner', '-formats'], { encoding: 'utf8' });
  const encoders = execFileSync(ffmpeg, ['-hide_banner', '-encoders'], { encoding: 'utf8' });
  const formatLines = formats.split('\n');
  const supportsMov = formatLines.some((line) => /^\s*D[ E]\s+mov,mp4(?:,|\s)/.test(line));
  const supportsMp4 = formatLines.some((line) => /^\s*[D ]E\s+mp4(?:,|\s)/.test(line))
    && /libx264/.test(encoders);
  const supportsWebm = formatLines.some((line) => /^\s*[D ]E\s+webm(?:,|\s)/.test(line))
    && /libvpx-vp9/.test(encoders);

  console.log('FFmpeg media capabilities:', {
    path: ffmpeg,
    supportsMov,
    supportsMp4,
    supportsWebm,
  });

  if (!supportsMov || !supportsMp4) {
    console.warn('Video skipped: selected FFmpeg lacks MOV input or H.264 MP4 output required for Team Video.MOV.');
    return false;
  }

  const input = join(sourceRoot, 'Team Video.MOV');
  execFileSync(ffmpeg, [
    '-y', '-i', input, '-vf', 'scale=-2:720', '-an', '-c:v', 'libx264', '-preset', 'medium',
    '-crf', '24', '-movflags', '+faststart', join(outputRoot, 'team-video-720.mp4'),
  ], { stdio: 'inherit' });

  if (supportsWebm) {
    execFileSync(ffmpeg, [
      '-y', '-i', input, '-vf', 'scale=-2:720', '-an', '-c:v', 'libvpx-vp9', '-crf', '34',
      '-b:v', '0', join(outputRoot, 'team-video-720.webm'),
    ], { stdio: 'inherit' });
  } else {
    console.warn('WebM skipped: the available FFmpeg has no WebM encoder.');
  }

  const temporaryPoster = join(outputRoot, 'team-video-poster.png');
  execFileSync(ffmpeg, [
    '-y', '-ss', '1', '-i', input, '-frames:v', '1', '-vf', 'scale=-2:720', temporaryPoster,
  ], { stdio: 'inherit' });
  await sharp(temporaryPoster).webp({ quality: 80, effort: 6 }).toFile(join(outputRoot, 'team-video-poster.webp'));
  await rm(temporaryPoster);

  const sourceBytes = (await stat(input)).size;
  const mp4Bytes = (await stat(join(outputRoot, 'team-video-720.mp4'))).size;
  if (mp4Bytes >= sourceBytes) {
    throw new Error(`Optimized MP4 is not smaller than its source (${mp4Bytes} >= ${sourceBytes}).`);
  }
  return true;
}

async function main() {
  await mkdir(outputRoot, { recursive: true });
  await Promise.all(images.map(([source, name]) => writeResponsiveImage(source, name)));
  await optimizeLogo();
  await optimizeVideo();

  const sourceBytes = (await stat(join(sourceRoot, 'Team Video.MOV'))).size;
  console.log(`Optimized ${images.length} authentic images. Source video is ${sourceBytes} bytes.`);
}

await main();
