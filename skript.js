const formspreeUrl = 'https://formspree.io/f/TVŮJ-KÓD'; // Vlož své Formspree ID
let prihlasenyUzivatel = JSON.parse(localStorage.getItem("uzivatelPrihlasen")) || null;

function aktualizujUI() {
  const userInfo = document.getElementById("userInfo");
  const btnOdhlasit = document.getElementById("btnOdhlasit");

  if (prihlasenyUzivatel) {
    userInfo.innerText = `${prihlasenyUzivatel.jmeno} ${prihlasenyUzivatel.prijmeni}`;
    btnOdhlasit.style.display = "inline";
  } else {
    userInfo.innerText = "";
    btnOdhlasit.style.display = "none";
  }
}

function zobrazPrihlaseni() {
  document.getElementById("modalPrihlaseni").style.display = "flex";
}

function zobrazRegistraci() {
  document.getElementById("modalRegistrace").style.display = "flex";
}

function zavritModal() {
  document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
}

function registrovat() {
  const jmeno = document.getElementById("regJmeno").value;
  const prijmeni = document.getElementById("regPrijmeni").value;
  const email = document.getElementById("regEmail").value;
  if (!jmeno || !prijmeni || !email) return alert("Vyplň všechna pole.");
  localStorage.setItem(`ucet-${email}`, JSON.stringify({ jmeno, prijmeni, email }));
  alert("Účet vytvořen.");
  zavritModal();
}

function prihlasit() {
  const email = document.getElementById("loginEmail").value;
  const zustat = document.getElementById("zustatPrihlasen").checked;
  const ucet = localStorage.getItem(`ucet-${email}`);
  if (!ucet) return alert("Účet neexistuje.");
  prihlasenyUzivatel = JSON.parse(ucet);
  if (zustat) localStorage.setItem("uzivatelPrihlasen", JSON.stringify(prihlasenyUzivatel));
  zavritModal();
  aktualizujUI();
}

function odhlasit() {
  prihlasenyUzivatel = null;
  localStorage.removeItem("uzivatelPrihlasen");
  aktualizujUI();
}

function odesliZadost(nazevTahaku) {
  let jmeno, prijmeni = "", email;
  if (prihlasenyUzivatel) {
    ({ jmeno, prijmeni, email } = prihlasenyUzivatel);
  } else {
    jmeno = prompt("Zadej své jméno:");
    if (!jmeno) return;
    email = "neuvedeno";
  }

  const potvrzovaciZprava = `Tahák "${nazevTahaku}" byl vytisknut pro ${jmeno}.`;

  const qr = new QRious({
    value: `mailto:${email}?subject=Potvrzení&body=${encodeURIComponent(potvrzovaciZprava)}`,
    size: 200
  });

  const qrDataURL = qr.toDataURL();

  const data = {
    tahak: nazevTahaku,
    jmeno: jmeno,
    prijmeni: prijmeni,
    email: email,
    qr: qrDataURL
  };

  fetch(formspreeUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (res.ok) {
      alert("Žádost byla odeslána.");
    } else {
      alert("Nepodařilo se odeslat žádost.");
    }
  });
}

aktualizujUI();

fetch('tahaky.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("seznamTahaku");
    data.forEach(tahak => {
      const div = document.createElement('div');
      div.className = 'tahak';
      div.innerHTML = `
        <h3>${tahak.nazev}</h3>
        <p><em>Autor: ${tahak.autor}</em></p>
        <button onclick="odesliZadost('${tahak.nazev}')">Poslat žádost o vytištění</button>
      `;
      container.appendChild(div);
    });
  });
