# Javascirpt oyun prompları
prompt: AABB Algoritmasını açıklar mısın?
cevap: AABB (Axis-Aligned Bounding Box) çarpışma algılama, iki dikdörtgenin (kutunun) eksenlere paralel (yani döndürülmemiş) olduğu durumlardaki en basit ve hızlı çarpışma testidir. Temel fikir, her dikdörtgenin sol, sağ, üst ve alt sınırlarını karşılaştırarak örtüşme olup olmadığını kontrol etmektir.

1. AABB Kutusunu Tanımlamak
Her bir nesne için dört değer yeterlidir:

js
Kopyala
Düzenle
// Örnek bir kutu:
let box = {
  x:  px,             // sol kenarın X koordinatı
  y:  py,             // üst kenarın Y koordinatı
  w:  width,         // genişlik
  h:  height         // yükseklik
};
// Sağ, alt sınırlar:
box.right  = box.x + box.w;
box.bottom = box.y + box.h;
2. Çarpışma Şartı
İki kutu (boxA ve boxB) çarpışıyorsa, her eksende şunlar eşzamanlı olmalıdır:

X ekseninde örtüşme

boxA’nın sağ kenarı, boxB’nin sol kenarından büyük olmalı

VE boxA’nın sol kenarı, boxB’nin sağ kenarından küçük olmalı

Y ekseninde örtüşme

boxA’nın alt kenarı, boxB’nin üst kenarından büyük olmalı

VE boxA’nın üst kenarı, boxB’nin alt kenarından küçük olmalı

Bunu tek bir if’le şöyle yazarız:

js
Kopyala
Düzenle
function AABBvsAABB(A, B) {
  return  A.x < B.x + B.w &&
          A.x + A.w > B.x &&
          A.y < B.y + B.h &&
          A.y + A.h > B.y;
}
A.x < B.x + B.w → A’nın sol kenarı, B’nin sağ kenarından sola taşmamış olmalı

A.x + A.w > B.x → A’nın sağ kenarı, B’nin sol kenarının sağına taşmış olmalı

Benzer şekilde Y ekseninde de üst/alt karşılaştırması yapıyoruz.

3. Pseudocode
kotlin
Kopyala
Düzenle
function çarpışıyorMu(kutuA, kutuB):
    if kutuA.left   < kutuB.right
    and kutuA.right > kutuB.left
    and kutuA.top   < kutuB.bottom
    and kutuA.bottom> kutuB.top:
        return true
    else:
        return false
4. Neden AABB?
Hızlıdır: Sadece 4 karşılaştırma ve toplama/çıkarma işlemi

Basittir: Kutular eksenlere paralel olduğu için dönüş matrisine gerek yok

Yaygın kullanılır: Platform oyunlarında zemin, duvar, nesne çarpışmaları için ideal

5. Örnek Kullanım
js
Kopyala
Düzenle
let oyuncu = { x:100, y:150, w:30, h:50 };
let duvar  = { x:120, y:180, w:200, h:20 };

if (AABBvsAABB(oyuncu, duvar)) {
  console.log("Çarpışma tespit edildi!");
}

