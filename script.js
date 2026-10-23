const KUNCI = "tugasku-v1";
const $ = (id) => document.getElementById(id);

let tugas = muat();     // array of { id, teks, prioritas, tenggat, selesai }
let filter = "semua";   // semua | belum | selesai
let idDiedit = null;    // id tugas yang sedang diedit

// ---------- Penyimpanan (localStorage) ----------
function muat() {
  try {
    const data = JSON.parse(localStorage.getItem(KUNCI));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function simpan() {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(tugas));
  } catch {
    // abaikan jika penyimpanan tidak tersedia
  }
}

// ---------- Fungsi bantu ----------
function hariIni() {
  return new Date().toLocaleDateString("sv-SE"); // format YYYY-MM-DD
}

function formatTanggal(str) {
  return new Date(str + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function buat(tag, kelas, teks) {
  const el = document.createElement(tag);
  if (kelas) el.className = kelas;
  if (teks !== undefined) el.textContent = teks;
  return el;
}

// ---------- Aksi ----------
function tambahTugas(e) {
  e.preventDefault();
  const teks = $("teks").value.trim();

  if (!teks) {
    $("pesan").textContent = "Tulis dulu tugasnya sebelum ditambahkan.";
    $("teks").focus();
    return;
  }
  $("pesan").textContent = "";

  tugas.unshift({
    id: Date.now(),
    teks,
    prioritas: $("prioritas").value,
    tenggat: $("tenggat").value,
    selesai: false,
  });

  $("teks").value = "";
  $("tenggat").value = "";
  $("teks").focus();
  simpan();
  render();
}

function ubahStatus(id) {
  const t = tugas.find((x) => x.id === id);
  if (t) t.selesai = !t.selesai;
  simpan();
  render();
}

function hapusTugas(id) {
  tugas = tugas.filter((x) => x.id !== id);
  simpan();
  render();
}

function simpanEdit(id, teksBaru) {
  const teks = teksBaru.trim();
  const t = tugas.find((x) => x.id === id);
  if (t && teks) t.teks = teks; // kosong = batal, teks lama dipertahankan
  idDiedit = null;
  simpan();
  render();
}

function hapusSelesai() {
  tugas = tugas.filter((x) => !x.selesai);
  simpan();
  render();
}

// ---------- Tampilan ----------
function buatItem(t) {
  const li = buat("li", "tugas " + t.prioritas + (t.selesai ? " selesai" : ""));
  li.dataset.id = t.id;

  const cek = buat("input");
  cek.type = "checkbox";
  cek.checked = t.selesai;
  cek.setAttribute("aria-label", "Tandai selesai: " + t.teks);
  li.appendChild(cek);

  const isi = buat("div", "isi");

  if (t.id === idDiedit) {
    const edit = buat("input", "edit-input");
    edit.type = "text";
    edit.maxLength = 100;
    edit.value = t.teks;
    edit.setAttribute("aria-label", "Ubah tugas");
    isi.appendChild(edit);
    li.appendChild(isi);
    setTimeout(() => edit.focus(), 0);
    return li;
  }

  isi.appendChild(buat("div", "teks", t.teks));

  const meta = buat("div", "meta", "Prioritas " + t.prioritas);
  if (t.tenggat) {
    meta.append(" · Tenggat " + formatTanggal(t.tenggat));
    if (!t.selesai && t.tenggat < hariIni()) {
      meta.append(" · ");
      meta.appendChild(buat("span", "terlambat", "Terlambat"));
    }
  }
  isi.appendChild(meta);
  li.appendChild(isi);

  const aksi = buat("div", "aksi");
  const btnUbah = buat("button", "ubah", "Ubah");
  const btnHapus = buat("button", "hapus", "Hapus");
  btnUbah.type = btnHapus.type = "button";
  aksi.append(btnUbah, btnHapus);
  li.appendChild(aksi);

  return li;
}

function render() {
  const tampil = tugas.filter((t) =>
    filter === "semua" ? true : filter === "selesai" ? t.selesai : !t.selesai
  );

  $("daftar").replaceChildren(...tampil.map(buatItem));

  // pesan kosong
  const kosong = $("kosong");
  kosong.hidden = tampil.length > 0;
  if (!tampil.length) {
    kosong.textContent =
      tugas.length === 0 ? "Belum ada tugas. Tambahkan yang pertama di atas."
      : filter === "selesai" ? "Belum ada tugas yang selesai."
      : "Semua tugas sudah selesai.";
  }

  // penghitung
  const sisa = tugas.filter((t) => !t.selesai).length;
  $("hitung").textContent = sisa + " tugas belum selesai dari " + tugas.length;
  $("hapus-selesai").hidden = !tugas.some((t) => t.selesai);

  // status tombol filter
  document.querySelectorAll("[data-filter]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.filter === filter))
  );
}

// ---------- Event ----------
$("form").addEventListener("submit", tambahTugas);
$("hapus-selesai").addEventListener("click", hapusSelesai);

document.querySelector(".filter").addEventListener("click", (e) => {
  const tombol = e.target.closest("[data-filter]");
  if (!tombol) return;
  filter = tombol.dataset.filter;
  render();
});

// satu listener untuk seluruh daftar (event delegation)
$("daftar").addEventListener("click", (e) => {
  const li = e.target.closest(".tugas");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.matches("input[type='checkbox']")) ubahStatus(id);
  else if (e.target.matches(".hapus")) hapusTugas(id);
  else if (e.target.matches(".ubah")) { idDiedit = id; render(); }
});

$("daftar").addEventListener("keydown", (e) => {
  if (!e.target.matches(".edit-input")) return;
  const id = Number(e.target.closest(".tugas").dataset.id);
  if (e.key === "Enter") simpanEdit(id, e.target.value);
  if (e.key === "Escape") { idDiedit = null; render(); }
});

$("daftar").addEventListener("focusout", (e) => {
  if (e.target.matches(".edit-input") && idDiedit !== null) {
    simpanEdit(Number(e.target.closest(".tugas").dataset.id), e.target.value);
  }
});

// ---------- Mulai ----------
$("tanggal").textContent = new Date().toLocaleDateString("id-ID", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});
render();