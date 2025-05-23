# Javascirpt oyun promptları
prompt: AABB Algoritmasını açıklar mısın?
cevap: 
# 🟥 AABB (Axis-Aligned Bounding Box) Algoritması

## 📌 Nedir?
AABB, **eksenlere hizalı dikdörtgenler** (döndürülmemiş kutular) arasında çarpışma olup olmadığını tespit etmek için kullanılan hızlı ve basit bir algoritmadır.

---

## 🔹 1. AABB Kutusu Tanımı
Her kutu şu şekilde tanımlanır:

```js
let box = {
  x: px,    // Sol üst köşe X
  y: py,    // Sol üst köşe Y
  w: width, // Genişlik
  h: height // Yükseklik
};

// Sağ ve alt sınırlar:
box.right  = box.x + box.w;
box.bottom = box.y + box.h;

