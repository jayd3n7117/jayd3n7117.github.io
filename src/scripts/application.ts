import { submitApplication, validateApplication } from "../application/schema";

document.querySelectorAll<HTMLFormElement>("[data-application-form]").forEach((form) => {
  const copy = JSON.parse(form.dataset.copy ?? "{}");
  const button = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
  const status = form.querySelector<HTMLElement>("[data-form-status]")!;
  let submitting = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    const raw: Record<string, unknown> = Object.fromEntries(new FormData(form));
    raw.consent = form.elements.namedItem("consent") instanceof HTMLInputElement && (form.elements.namedItem("consent") as HTMLInputElement).checked;
    const result = validateApplication(raw);
    form.querySelectorAll<HTMLElement>("[data-error-for]").forEach((element) => { element.textContent = ""; });
    form.querySelectorAll("[aria-invalid=true]").forEach((element) => element.removeAttribute("aria-invalid"));

    if (!result.valid) {
      for (const [field, code] of Object.entries(result.errors)) {
        form.querySelector<HTMLElement>(`[data-error-for="${field}"]`)!.textContent = copy.errors[code as string];
        const control = form.elements.namedItem(field);
        if (control instanceof HTMLElement) control.setAttribute("aria-invalid", "true");
      }
      status.setAttribute("role", "alert");
      status.textContent = copy.invalid;
      (form.querySelector("[aria-invalid=true]") as HTMLElement | null)?.focus();
      return;
    }

    submitting = true;
    button.disabled = true;
    button.textContent = copy.submitting;
    const response = await submitApplication(result.data);
    submitting = false;
    button.disabled = false;
    button.textContent = copy.submit;
    status.setAttribute("role", response.ok ? "status" : "alert");
    status.textContent = response.ok ? copy.success : copy.failure;
    if (response.ok) form.reset();
  });
});
