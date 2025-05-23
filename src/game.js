// Gerçek seviye sistemi + skorla kapı + sonsuz platform üretimi

const cizimalani = document.getElementById("oyuncizimalani"); // burasi kanvas
const cizim = cizimalani.getContext("2d");                    // burasi cizim yapmak icin var

// icardi resminin yolu
const karakter = new Image();
karakter.src = "resimler/icardi.png";

// Platform görseli
const platformfotosi = new Image();
platformfotosi.src = "resimler/grass.png";

// offsat görlesi bu tuzak olcak
const tuzakfotosi = new Image();
tuzakfotosi.src = "resimler/ofsayt2.png";

// Ödül (yıldız) yerine futbol topu
const yildizfotosi = new Image();
yildizfotosi.src = "resimler/ball2.png";

// Kapı yerine kupa
const gol = new Image();
gol.src = "resimler/kupa.png";

// Kuşlar için kanarya resmi
const kus = new Image();
kus.src = "resimler/kanarya.png";

//arka plan için stat resmi
let arkaplanhazir = false;
const arkaplanfotosi = new Image();
arkaplanfotosi.src = "resimler/wal.jpg";  // 👈 dosya adı ve uzantısı birebir böyle olmalı
arkaplanfotosi.onload = () => {
  arkaplanhazir = true;
};


let oyuncugenislik = 30, oyuncuboy = 50;
let oyuncukonumX = 0, oyuncukonumY = 0;
let yHizi = 0;
let yercekimi = 0.4;
let zipzipgücü = -15;
let zilpayabilirmi = true, zipliyor = false;
let playerSpeed = 7;

let sagtusbasildi = false, soltusbasildi = false;
let oyunbasladi = false, oyunbitti = false;
let skor = 0, toplanabilirler = 0;
let level = 1;
let levelgecildi = false;
let leveldelaysuresi = 0;

let platformlar = [], tuzaklar = [], yildizlar = [], ucanseyler = [];

let kupaaaaaa = { x: 0, y: 0, width: 40, height: 60, visible: false };

const arkaplankatmanlari = [
  { x: 0, speed: 0.2, color: "#b3e5fc" },
  { x: 0, speed: 1, color: "#81d4fa" }
];

let calanmuzik = new Audio("sesler/background.mp3");
calanmuzik.loop = true; calanmuzik.volume = 0.2;
function zipzipmuzigi() { new Audio("sesler/jump.wav").play(); }

let platformhizi = 2;
const kucukaralik = 80, maxaralik = 120;
const minHeight = 200, maxHeight = 350;
const platformgenislik = 200, platformyukseklik = 20;

function leveluretmesistemi() {
  
  // burada leveldeki objeleri listede tutuyoruz, sonra push ile objeleri sona pushlicaz, pushlanan hep sona eklenir
  platformlar = [];
  tuzaklar = [];
  yildizlar = [];
  ucanseyler = [];
  kupaaaaaa.visible = false; // kupaa ilk başta gözükmez

  let x = 0;
  while (x < cizimalani.width + 400) {
    let y = minHeight + Math.random() * (maxHeight - minHeight);
    platformlar.push({ x, y, width: platformgenislik, height: platformyukseklik });
    x += platformgenislik + kucukaralik + Math.random() * (maxaralik - kucukaralik);
  }

  const tuzaklarize = 40;
  const yildizlarize = 32;
  platformlar.forEach((p, i) => {
    if (i === 0) return;

    if (Math.random() < 0.2 + level * 0.02) {
      let trapX = p.x + (p.width - tuzaklarize) / 2;
      let trapY = p.y - tuzaklarize;
      tuzaklar.push({ x: trapX, y: trapY, size: tuzaklarize });
    } else if (Math.random() < 0.15) {
      let starX = p.x + (p.width - yildizlarize) / 2;
      let starY = p.y - yildizlarize - 10;
      yildizlar.push({ x: starX, y: starY, size: yildizlarize, rotation: 0 });
    }
  });

  if (level >= 2) {
    const kusSayisi = level === 2 ? 3 : 2 + Math.floor(level / 2);
    for (let i = 0; i < kusSayisi; i++) {
      let kanaryakonumX = cizimalani.width + Math.random() * 400;
      let kanaryakonumY = 80 + Math.random() * 150;
      let kanarkayonu = Math.random() < 0.5 ? 1 : -1;
      ucanseyler.push({ x: kanaryakonumX, y: kanaryakonumY, width: 40, height: 40, kanarkayonu });
    }
  }
}
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") sagtusbasildi = true; // sag tus kontrolu icin var bu ArrowRight sag tus demek
  if (e.key === "ArrowLeft") soltusbasildi = true; // sol tus kontrolu icin var bu ArrowRight sag tus demek
  if ((e.key === " " || e.code === "Space") && !oyunbasladi && !oyunbitti) {
    oyunbasladi = true;
    calanmuzik.play();
    return;
  }
  if ((e.key === " " || e.code === "Space") && zilpayabilirmi && oyunbasladi && !oyunbitti) { // zıplama kontrolü için var burasi
    yHizi = zipzipgücü;
    zipliyor = true;
    zilpayabilirmi = false;
    zipzipmuzigi();
  }
  if ((e.key === "r" || e.key === "R") && oyunbitti) oyunutekrarbaslat(); // R tusuna basilirse tekrar  başlat oyunu
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowRight") sagtusbasildi = false;
  if (e.key === "ArrowLeft") soltusbasildi = false;
});

function oyunutekrarbaslat() {
  oyunbitti = false; oyunbasladi = false;
  skor = 0; toplanabilirler = 0; level = 1;
  platformhizi = 2;
  leveluretmesistemi();
  let ilkplatform = platformlar[0];
  oyuncukonumX = ilkplatform.x + (ilkplatform.width - oyuncugenislik) / 2;
  oyuncukonumY = ilkplatform.y - oyuncuboy;
  yHizi = 0; zilpayabilirmi = true;
  arkaplaniciz();
}

// arka plan cizilr
function arkaplaniciz() {
  if (arkaplanfotosi.complete) {
    cizim.drawImage(arkaplanfotosi, 0, 0, cizimalani.width, cizimalani.height); // w ve h ye göre doldur 
  } else {
    cizim.fillStyle = "#b3e5fc"; // Yedek mavi arka plan  
    cizim.fillRect(0, 0, cizimalani.width, cizimalani.height);
    
  }
  
  skor += 0.10;
 

  


  arkaplankatmanlari.forEach(layer => {
    layer.x -= layer.speed; 
    if (layer.x <= -cizimalani.width) layer.x = 0;
    cizim.fillStyle = layer.color;
    cizim.fillRect(layer.x, 0, cizimalani.width, cizimalani.height);
    cizim.fillRect(layer.x + cizimalani.width, 0, cizimalani.width, cizimalani.height);
  }); 
  if (arkaplanhazir) {
  // 164
  cizim.drawImage(arkaplanfotosi, 0, 0, cizimalani.width, cizimalani.height);
} else {
  // 167
  cizim.fillStyle = "#b3e5fc";
  cizim.fillRect(0, 0, cizimalani.width, cizimalani.height);
}


  if (!oyunbasladi && !oyunbitti) {
    
    cizim.fillStyle = "white";
    cizim.font = "30px Arial";
    cizim.fillText("BAŞLAMAK İÇİN SPACE TUŞUNA BAS", 80, cizimalani.height / 2);
    
    requestAnimationFrame(arkaplaniciz);
    return;
  }

  if (oyunbitti) {
    cizim.fillStyle = "red";
    cizim.font = "40px Arial";
    cizim.fillText("OYUN BİTTİ", cizimalani.width / 2 - 120, cizimalani.height / 2);
    cizim.font = "20px Arial";
    cizim.fillText("R TUSUNA BASARAK YENIDEN BASLAT", cizimalani.width / 2 - 170, cizimalani.height / 2 + 40);
    return;
  }

  if (levelgecildi) {
    leveldelaysuresi++;
    cizim.fillStyle = "white";
    cizim.font = "30px Arial";
    cizim.fillText("SEVIYE " + (level - 1) + " GECILDI!", cizimalani.width / 2 - 100, cizimalani.height / 2);
    if (leveldelaysuresi > 90) {
      levelgecildi = false;
      leveldelaysuresi = 0;
      leveluretmesistemi();
      let ilkplatform = platformlar[0];
      oyuncukonumX = ilkplatform.x + (ilkplatform.width - oyuncugenislik) / 2;
      oyuncukonumY = ilkplatform.y - oyuncuboy;
      yHizi = 0;
      zilpayabilirmi = true;
    } else {
      requestAnimationFrame(arkaplaniciz); // arkaplaniciznu callback alarak level gecildikten sonra tekrar bakar
      return;
    }
  }

  platformlar.forEach(p => p.x -= platformhizi);
  tuzaklar.forEach(t => t.x -= platformhizi);
  yildizlar.forEach(s => s.x -= platformhizi);
  ucanseyler.forEach(e => e.x -= platformhizi);
  if (kupaaaaaa.visible) kupaaaaaa.x -= platformhizi;

  if (platformlar.length > 0 && platformlar[0].x + platformgenislik < 0) {
    platformlar.shift();
    let last = platformlar[platformlar.length - 1];
    let x = last.x + platformgenislik + kucukaralik + Math.random() * (maxaralik - kucukaralik);
    let y = minHeight + Math.random() * (maxHeight - minHeight);
    platformlar.push({ x, y, width: platformgenislik, height: platformyukseklik });

    if (Math.random() < 0.2 + level * 0.02) {
      tuzaklar.push({ x: x + Math.random() * (platformgenislik - 20), y: y - 20, size: 40 });
    } else if (Math.random() < 0.25) {
      yildizlar.push({ x: x + platformgenislik / 2 - 8, y: y - 30, size: 32 });
    }
  }

  // tuslara göre konum kontrolü, konum = pozisyon + hız mantığı var

  if (sagtusbasildi) oyuncukonumX += playerSpeed;
  if (soltusbasildi) oyuncukonumX -= playerSpeed;
  yHizi += yercekimi;
  oyuncukonumY += yHizi;
  

  // platforma degip degmediği kontrolü
  platformlar.forEach(p => {
    if (
      oyuncukonumX + oyuncugenislik > p.x &&
      oyuncukonumX < p.x + p.width &&
      oyuncukonumY + oyuncuboy >= p.y &&
      oyuncukonumY + oyuncuboy <= p.y + p.height + 5
    ) {
      oyuncukonumY = p.y - oyuncuboy;
      yHizi = 0;
      zilpayabilirmi = true; // burada eğer platforma değiyor isem ziplayabilirim
      // skor += 0.2;
    }
  });
  // tuzaklar carptığımızda aslında AABB algoritmasına göre çarpıp çarpmadığımızı belirler.
  tuzaklar.forEach(t => {
    if (
      oyuncukonumX + oyuncugenislik > t.x &&
      oyuncukonumX < t.x + t.size &&
      oyuncukonumY + oyuncuboy > t.y &&
      oyuncukonumY < t.y + t.size
    ) {
      oyunbitti = true;
      
    }
  });
  // yildizlar carptığımızda aslında AABB algoritmasına göre çarpıp çarpmadığımızı belirler.
  yildizlar = yildizlar.filter(s => {
    if (
      oyuncukonumX + oyuncugenislik > s.x &&
      oyuncukonumX < s.x + s.size &&
      oyuncukonumY + oyuncuboy > s.y &&
      oyuncukonumY < s.y + s.size
    ) {
      toplanabilirler++;
      
      skor += 10;
      if (toplanabilirler >= 3) {
        zilpayabilirmi = true;
        toplanabilirler = 0;
      }
      return false;
    }
    return true;
  });

  // kanaryalara carptığımızda aslında AABB algoritmasına göre çarpıp çarpmadığımızı belirler.
  ucanseyler.forEach(e => {
    e.x += e.kanarkayonu * 2;
    if (e.x < 0 || e.x + e.width > cizimalani.width) e.kanarkayonu *= -1;
    if (
      oyuncukonumX + oyuncugenislik > e.x &&
      oyuncukonumX < e.x + e.width &&
      oyuncukonumY + oyuncuboy > e.y &&
      oyuncukonumY < e.y + e.height
    ) {
      oyunbitti = true;
      
    }
  });

  if (oyuncukonumY > cizimalani.height) {
    oyunbitti = true;  
    
  }

  if (!kupaaaaaa.visible && skor >= 200 * level) {
  console.log("Skor yeterli, kapı çıkmalı.");
  if (platformlar.length >= 2) {
    let p = platformlar[platformlar.length - 2];
    kupaaaaaa.x = p.x + p.width / 2 - kupaaaaaa.width / 2;
    kupaaaaaa.y = p.y - kupaaaaaa.height;
    kupaaaaaa.visible = true;
    console.log("KAPI ÇIKARILDI:", kupaaaaaa);
  } else {
    console.log("Yeterli platform yok! platformlar.length = " + platformlar.length);
  }
}


  if (
    kupaaaaaa.visible &&
    oyuncukonumX + oyuncugenislik > kupaaaaaa.x &&
    oyuncukonumX < kupaaaaaa.x + kupaaaaaa.width &&
    oyuncukonumY + oyuncuboy > kupaaaaaa.y &&
    oyuncukonumY < kupaaaaaa.y + kupaaaaaa.height
  ) {
    level++;
    platformhizi += 0.5;
    skor = 0;
    kupaaaaaa.visible = false;
    levelgecildi = true;
  }

  // platformları çizmek icin var bu cimenler cizilr
  platformlar.forEach(p => {
    if (platformfotosi.complete) {
      cizim.drawImage(platformfotosi, p.x, p.y, p.width, p.height);
    } else {
      cizim.fillStyle = "#888";
      cizim.fillRect(p.x, p.y, p.width, p.height);
    }
  });

tuzaklar.forEach(t => {
  if (tuzakfotosi.complete) {
    cizim.drawImage(tuzakfotosi, t.x, t.y, t.size, t.size);
  } else {
    cizim.fillStyle = "red";
    cizim.fillRect(t.x, t.y, t.size, t.size);
  }
});

const yildizlarize = 32;
// yildizları cizmek için var bu
yildizlar.forEach(s => {
  // topu dönderiyoruz burada
  s.rotation += 0.05;

  if (yildizfotosi.complete) {
    cizim.save(); // mevcut durumu kaydet
    cizim.translate(s.x + s.size / 2, s.y + s.size / 2); // /2 ile topun merkezine gidiyoruz
    cizim.rotate(s.rotation); // Döndür
    cizim.drawImage(yildizfotosi, -s.size / 2, -s.size / 2, s.size, s.size); // merkez tarafından çizim yapmak için var bu
    cizim.restore(); // restore ile önceki duruma gitmek için var
  } else {
    cizim.fillStyle = "yellow"; // sarı renk
    cizim.beginPath();
    cizim.arc(s.x + s.size / 2, s.y + s.size / 2, s.size / 2, 0, Math.PI * 2); // topun yayı için dış hattı için yay olarka
    cizim.fill();
  }
});

  ucanseyler.forEach(e => {
  if (kus.complete) {
    cizim.drawImage(kus, e.x, e.y, e.width, e.height);
  } else {
    cizim.fillStyle = "purple"; // mor renk
    cizim.fillRect(e.x, e.y, e.width, e.height);
  }
});
  // eger kupa görünürse
  if (kupaaaaaa.visible) {
  if (gol.complete) {
    cizim.drawImage(gol, kupaaaaaa.x, kupaaaaaa.y, kupaaaaaa.width, kupaaaaaa.height); // kupayı konumlarına göre çiziyoruz
  } else {
    cizim.fillStyle = "blue";
    cizim.fillRect(kupaaaaaa.x, kupaaaaaa.y, kupaaaaaa.width, kupaaaaaa.height); // kupayı dolduruyoruz fill ile
  }
}


  // oyuncu
  if (karakter.complete) {
    cizim.drawImage(karakter, oyuncukonumX, oyuncukonumY, oyuncugenislik, oyuncuboy);
  } else {
    cizim.fillStyle = "lime";
    cizim.fillRect(oyuncukonumX, oyuncukonumY, oyuncugenislik, oyuncuboy); // oyuncuyu konumlarına göre çizmek için
  }

  cizim.fillStyle = "white";
  cizim.font = "20px Arial";
  cizim.fillText("Skor: " + Math.floor(skor) + "  Level: " + level, 10, 30);

  requestAnimationFrame(arkaplaniciz);
}

leveluretmesistemi();
let ilkplatform = platformlar[0];
oyuncukonumX = ilkplatform.x + (ilkplatform.width - oyuncugenislik) / 2;
oyuncukonumY = ilkplatform.y - oyuncuboy;
yHizi = 0;
zilpayabilirmi = true;
arkaplaniciz();