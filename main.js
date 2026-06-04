// 1. Deprem girişi - 3 saniye sonra yavaşça kapanır
var deprem = document.getElementById("deprem-giris");
setTimeout(function () {
  deprem.classList.add("kapaniyor");
  setTimeout(function () {
    deprem.classList.add("kapali");
  }, 600);
}, 3000);

// 2. Mobil menü
var menuBtn = document.getElementById("menu-btn");
var menu = document.getElementById("menu");

menuBtn.addEventListener("click", function () {
  menu.classList.toggle("acik");
});

// 3. Yer filtreleme
var filtreler = document.querySelectorAll(".filtre");
var kartlar = document.querySelectorAll(".kart");

for (var i = 0; i < filtreler.length; i++) {
  filtreler[i].addEventListener("click", function () {
    var tur = this.getAttribute("data-tur");

    // aktif buton
    for (var j = 0; j < filtreler.length; j++) {
      filtreler[j].classList.remove("aktif");
    }
    this.classList.add("aktif");

    // kartları göster/gizle
    for (var k = 0; k < kartlar.length; k++) {
      var kartTur = kartlar[k].getAttribute("data-tur");
      if (tur === "hepsi" || kartTur === tur) {
        kartlar[k].style.display = "block";
      } else {
        kartlar[k].style.display = "none";
      }
    }
  });
}

// 4. Kültür sekmeleri
var sekmeler = document.querySelectorAll(".sekme");
var kulturPanel = document.getElementById("kultur-icerik");
var yemekPanel = document.getElementById("yemek-icerik");

for (var s = 0; s < sekmeler.length; s++) {
  sekmeler[s].addEventListener("click", function () {
    var hedefId = this.getAttribute("data-hedef");

    for (var t = 0; t < sekmeler.length; t++) {
      sekmeler[t].classList.remove("aktif");
    }
    this.classList.add("aktif");

    kulturPanel.classList.remove("aktif");
    yemekPanel.classList.remove("aktif");

    if (hedefId === "kultur-icerik") {
      kulturPanel.classList.add("aktif");
    } else {
      yemekPanel.classList.add("aktif");
    }
  });
}

// 5. Form doğrulama ve EmailJS Entegrasyonu
// Bu üç değeri https://dashboard.emailjs.com adresinden kopyalayın (hesabınızdaki gerçek ID'ler)
var EMAILJS_PUBLIC_KEY = "QsCW3hMX7PSy_EQKQ";       // Account → API Keys → Public Key
var EMAILJS_SERVICE_ID = "service_ytdf34j";         // Email Services → Service ID
var EMAILJS_TEMPLATE_ID = "template_q4ii3h8";         // Email Templates → Template ID (paneldekiyle aynı olmalı)

var form = document.getElementById("form");

function emailJsHataMetni(error) {
  if (!error) return "Bilinmeyen hata";
  if (error.text) return error.text;
  if (error.status) return "HTTP " + error.status;
  return String(error);
}

function butonuSifirla(btn, metin) {
  btn.textContent = metin;
  btn.disabled = false;
}

function emailJsYardimMetni(hataMetni, origin) {
  var alt = hataMetni.toLowerCase();
  if (alt.indexOf("template id not found") !== -1) {
    return (
      "\n\nÇözüm: dashboard.emailjs.com → Email Templates → şablonunuzu açın.\n" +
      "Sağ üstte veya ayarlarda görünen Template ID'yi kopyalayıp main.js içindeki\n" +
      "EMAILJS_TEMPLATE_ID değerini değiştirin.\n" +
      "Şu an kodda: " + EMAILJS_TEMPLATE_ID + " (bu ID hesabınızda yok)."
    );
  }
  if (alt.indexOf("service id") !== -1 && alt.indexOf("not found") !== -1) {
    return (
      "\n\nÇözüm: Email Services bölümünden doğru Service ID'yi kopyalayıp\n" +
      "main.js içindeki EMAILJS_SERVICE_ID değerini güncelleyin."
    );
  }
  if (alt.indexOf("origin") !== -1 || alt.indexOf("forbidden") !== -1) {
    return (
      "\n\nÇözüm: Account → Security → Allowed Origins listesine ekleyin:\n" + origin
    );
  }
  return "\n\nŞablon değişkenleri ({{from_name}}, {{message}} vb.) paneldekiyle uyumlu olmalı.";
}

if (!form) {
  console.error("İletişim formu (#form) bulunamadı.");
} else form.addEventListener("submit", function (e) {
  e.preventDefault();

  var ad = document.getElementById("ad");
  var eposta = document.getElementById("eposta");
  var mesaj = document.getElementById("mesaj");
  var onay = document.getElementById("onay");
  var gecerli = true;

  // hataları temizle
  document.getElementById("ad-hata").textContent = "";
  document.getElementById("eposta-hata").textContent = "";
  document.getElementById("mesaj-hata").textContent = "";
  document.getElementById("onay-hata").textContent = "";
  ad.classList.remove("hatali");
  eposta.classList.remove("hatali");
  mesaj.classList.remove("hatali");

  if (ad.value.trim().length < 2) {
    document.getElementById("ad-hata").textContent = "Ad en az 2 karakter olmalı.";
    ad.classList.add("hatali");
    gecerli = false;
  }

  if (eposta.value.indexOf("@") === -1 || eposta.value.indexOf(".") === -1) {
    document.getElementById("eposta-hata").textContent = "Geçerli e-posta girin.";
    eposta.classList.add("hatali");
    gecerli = false;
  }

  if (mesaj.value.trim().length < 10) {
    document.getElementById("mesaj-hata").textContent = "Mesaj en az 10 karakter olmalı.";
    mesaj.classList.add("hatali");
    gecerli = false;
  }

  if (!onay.checked) {
    document.getElementById("onay-hata").textContent = "Onay kutusunu işaretleyin.";
    gecerli = false;
  }

  // Form doğrulama başarılı ise e-posta gönderilir
  if (gecerli) {
    if (window.location.protocol === "file:") {
      alert(
        "Sayfa dosya olarak açılmış (file://). EmailJS çalışmaz.\n\n" +
        "VS Code Live Server veya şu adresle deneyin:\nhttp://127.0.0.1:8765"
      );
      return;
    }

    if (typeof emailjs === "undefined") {
      alert("EmailJS kütüphanesi yüklenemedi. İnternet bağlantınızı veya reklam engelleyiciyi kontrol edin.");
      return;
    }

    var adDeger = ad.value.trim();
    var epostaDeger = eposta.value.trim();
    var mesajDeger = mesaj.value.trim();

    // Şablondaki {{...}} isimleri farklı olabilir; yaygın adları birlikte gönderiyoruz
    var templateParams = {
      from_name: adDeger,
      name: adDeger,
      user_name: adDeger,
      from_email: epostaDeger,
      reply_to: epostaDeger,
      user_email: epostaDeger,
      reply_email: epostaDeger,
      message: mesajDeger
    };

    var submitBtn = form.querySelector("button[type='submit']");
    var eskiButonMetni = submitBtn.textContent;
    submitBtn.textContent = "Gönderiliyor...";
    submitBtn.disabled = true;

    var emailJsSecenek = { publicKey: EMAILJS_PUBLIC_KEY };

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, emailJsSecenek)
      .then(function (response) {
        console.log("EmailJS başarılı:", response.status, response.text);
        document.getElementById("basarili").classList.remove("gizli");
        form.reset();
        setTimeout(function () {
          document.getElementById("basarili").classList.add("gizli");
        }, 4000);
        butonuSifirla(submitBtn, eskiButonMetni);
      })
      .catch(function (error) {
        console.error("EmailJS hata:", error);
        var metin = emailJsHataMetni(error);
        var origin = window.location.origin || window.location.href;
        alert("E-posta gönderilemedi:\n" + metin + emailJsYardimMetni(metin, origin));
        butonuSifirla(submitBtn, eskiButonMetni);
      });
  }
});