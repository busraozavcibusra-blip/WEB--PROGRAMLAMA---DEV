// Deprem girişi - 3 saniye sonra yavaşça kapanır
var deprem = document.getElementById("deprem-giris");
setTimeout(function () {
  deprem.classList.add("kapaniyor");
  setTimeout(function () {
    deprem.classList.add("kapali");
  }, 600);
}, 3000);

// Mobil menü
var menuBtn = document.getElementById("menu-btn");
var menu = document.getElementById("menu");

menuBtn.addEventListener("click", function () {
  menu.classList.toggle("acik");
});

// Yer filtreleme
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

// Kültür sekmeleri
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

// Form doğrulama
var form = document.getElementById("form");

form.addEventListener("submit", function (e) {
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

  if (gecerli) {
    document.getElementById("basarili").classList.remove("gizli");
    form.reset();
    setTimeout(function () {
      document.getElementById("basarili").classList.add("gizli");
    }, 4000);
  }
});
