// wilayah
function hitungwilayah() {
    let carbon = { 
        sumatra: 0.82,
        jawa: 0.87,
        kalimantan: 0.84,
        sulawesi: 0.83,
        papua: 0.85 
    };
    let daya = parseInt(document.getElementById('daya').value);
    let wilayah = document.getElementById('jaringan').value;
    let periodePemakaian = document.getElementById('pwilayah').value;

    if (isNaN(daya) || daya <= 0) {
        alert('Masukkan nilai yang valid');
        return;
    }

    let faktorPeriode = periodePemakaian === 'tahunan' ? 365 : periodePemakaian === 'bulanan' ? 12 : 1;
    let emisi = carbon[wilayah];
    let totalEmisi = daya * emisi * faktorPeriode;

    document.getElementById('result').innerHTML = `Total Emisi Karbon: ${totalEmisi} gCO₂`;

    simpanHistori({ type: "wilayah", wilayah, daya, emisi, totalEmisi, periodePemakaian });
}

// elektronik
function hitungelektronik() {
    let carbonele = { 
        smartphone: 0.02, 
        laptop: 0.05, 
        tv: 0.1, 
        refrigerator: 0.2, 
        ricecooker: 0.15 
    };
    let elektro = document.getElementById('elektro').value;
    let jumlahSatuan = parseInt(document.getElementById('selek').value);
    let lamaPenggunaan = parseInt(document.getElementById('delek').value);
    let periodePemakaian = document.getElementById('pelek').value;

    if (!elektro || isNaN(jumlahSatuan) || jumlahSatuan <= 0 || isNaN(lamaPenggunaan) || lamaPenggunaan <= 0) {
        alert('Masukkan nilai yang valid untuk semua field!');
        return;
    }

    let faktorPeriode = periodePemakaian === 'tahunan' ? 365 : periodePemakaian === 'bulanan' ? 12 : 1;
    let totalHours = lamaPenggunaan * faktorPeriode;
    let totalEmisi = jumlahSatuan * carbonele[elektro] * totalHours;

    document.getElementById('resultelek').innerHTML = `Total Emisi Karbon: ${totalEmisi.toFixed(2)} gCO₂`;
    simpanHistori({ type: "elektronik", elektro, jumlahSatuan, lamaPenggunaan, periodePemakaian, totalEmisi });
}

// ac
function hitungac() {
    let carbon = { 
        0.5: 0.32,
        1: 0.63, 
        1.5: 0.93, 
        2: 1.27, 
        2.5: 1.59, 
        3: 1.90 
    };
    let kapasitasAC = parseFloat(document.getElementById('kapasitas-ac').value);
    let jumlahAC = parseInt(document.getElementById('jumlah-ac').value);
    let jamPenggunaan = parseInt(document.getElementById('jam-penggunaan').value);
    let periode = document.getElementById('pac').value;

    if (isNaN(kapasitasAC) || isNaN(jumlahAC) || isNaN(jamPenggunaan) || jumlahAC <= 0 || jamPenggunaan <= 0) {
        alert('Masukkan nilai yang valid!');
        return;
    }

    let faktorPeriode = periode === 'tahunan' ? 365 : periode === 'bulanan' ? 30 : 1;
    let totalEmisi = carbon[kapasitasAC] * jumlahAC * jamPenggunaan * faktorPeriode;

    document.getElementById('resultac').innerHTML = `Total Emisi Karbon AC: ${totalEmisi.toFixed(2)} kgCO₂`;
    simpanHistori({ type: "AC", kapasitasAC, jumlahAC, jamPenggunaan, periode, totalEmisi });
}


// histori
function simpanHistori(entry) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(entry);
    localStorage.setItem('history', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    let historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    history.forEach((entry, index) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `${formatHistory(entry)} <button onclick="deleteHistory(${index})">Hapus</button>`;
        historyList.appendChild(listItem);
    });
}

function formatHistory(entry) {
    if (entry.type === "wilayah") {
        return `Wilayah: ${entry.wilayah}, Daya: ${entry.daya} kWh, Emisi: ${entry.totalEmisi} gCO₂`;
    } else if (entry.type === "elektronik") {
        return `Perangkat: ${entry.elektro}, Jumlah: ${entry.jumlahSatuan}, Lama: ${entry.lamaPenggunaan} jam/hari, Periode: ${entry.periodePemakaian}, Emisi: ${entry.totalEmisi.toFixed(2)} gCO₂`;
    } else if (entry.type === "AC") {
        return `AC ${entry.kapasitasAC} PK, Jumlah: ${entry.jumlahAC}, Lama: ${entry.jamPenggunaan} jam/${entry.periode}, Emisi: ${entry.totalEmisi.toFixed(2)} kgCO₂`;
    }
    return "";
}

function deleteHistory(index) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.splice(index, 1);
    localStorage.setItem('history', JSON.stringify(history));
    loadHistory();
}

function clearHistory() {
    localStorage.removeItem('history');
    loadHistory();
}

function calculateTotalEmissions() {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    let totalEmisi = history.reduce((sum, entry) => sum + entry.totalEmisi, 0);

    let totalEmisiElement = document.getElementById('total-emisi');
    if (!totalEmisiElement) {
        totalEmisiElement = document.createElement('div');
        totalEmisiElement.id = 'total-emisi';
        document.querySelector('main').appendChild(totalEmisiElement);
    }
    totalEmisiElement.innerHTML = `<h2>Total Emisi Karbon: ${totalEmisi} gCO₂</h2>`;
}

window.onload = function() {
    loadHistory();
    calculateTotalEmissions();
};
