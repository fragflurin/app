// Hier kommt später die Adresse des E-Mail-Speichers hinein (z. B. ein Formular-Dienst in CH/EU).
// Solange das leer ist, wird NICHTS gespeichert und die Seite sagt das auch ehrlich.
const ENDPOINT = "https://formspree.io/f/xbgdoegj";

document.querySelectorAll("form.warteliste").forEach((form) => {
  const meldung = form.querySelector(".meldung");
  const button = form.querySelector("button");
  const zeige = (text, art) => { meldung.textContent = text; meldung.className = "meldung " + art; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (form.querySelector(".hp input").value) return; // Spam-Falle
    if (!form.email.checkValidity() || !email) return zeige("Bitte prüf die E-Mail-Adresse.", "fehler");
    if (!form.einwilligung.checked) return zeige("Bitte stimm zu, damit wir dir schreiben dürfen.", "fehler");

    if (!ENDPOINT) return zeige("Testmodus: Es wurde noch nichts gespeichert.", "fehler");

    button.disabled = true;
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, einwilligung: true, zeit: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      zeige("Danke! Du bist auf der Warteliste.", "ok");
    } catch {
      zeige("Das hat leider nicht geklappt. Versuch es bitte nochmal.", "fehler");
    }
    button.disabled = false;
  });
});
