let b;
let kontrol = [];
let initialDegisen = 0;
let firstRun = 1;
let dataLength = 0; // Kullanıcının belirttiği veri uzunluğunu saklayacak değişken
let processDataCount = 0;

function getDataLength() {
    dataLength = parseInt(document.getElementById('dataLength').value, 10);
    if (dataLength > 0) {
        document.getElementById('dataEntrySection').style.display = 'block';
    } else {
        alert('Hata: Geçerli bir veri uzunluğu girin.');
    }
}

function processData() {
    const dataArray = document.getElementById('dataArray').value.split(' ').map(Number);
    const m = dataArray.length;
    processDataCount++; 

    if (m > dataLength) {
        alert(`Hata: Girdiğiniz veri uzunluğu belirtilen uzunluğu (${dataLength}) aşıyor.`);
        return;
    }

    if (dataArray.some(bit => bit !== 0 && bit !== 1)) {
        alert('Lütfen sadece 0 veya 1 girin.');
        return;
    }

    let r = 0;
    while (true) {
        if (m + r + 1 <= Math.pow(2, r)) {
            b = r;
            break;
        }
        r++;
    }

    const n = m + r;
    const yenidizi = new Array(n).fill(0);
    let j = 0;
    for (let i = 0; i < n; i++) {
        if ((i + 1) === Math.pow(2, j)) {
            yenidizi[n - 1 - i] = 8;
            j++;
        } else {
            yenidizi[n - 1 - i] = dataArray[m - 1 - (i - j)];
        }
    }

    kontrol = new Array(b).fill(0);
    let x = 0;
    let y = 0;
    const veridizisi = new Array(n).fill(0);
    for (x = 0, y = 0; x < n; x++) {
        if ((x + 1) == (1 << y)) { // 2^n-1 konumlarını kontrol edin
            veridizisi[n - 1 - x] = kontrol[y]; // 'kontrol' dizisinin uygun değerlerini ata
            y++;
        } else {
            // 'yenidizi' dizisindeki 8 değerleri atlayarak gerçek verileri 'veridizisi' dizisine kopyala
            if (yenidizi[n - 1 - x] != 8) { // '8' değilse, kopyala
                veridizisi[n - 1 - x] = yenidizi[n - 1 - x]; // Doğrudan değeri kopyala
            } else { // '8' ise, '0' ata (veya başka bir işlem yapılabilir)
                veridizisi[n - 1 - x] = 0; // '0' değerini ata
            }
        }
    }

    let bitIndex = 0;
    for (let i = n - 1; i >= 0; i--) {
        if (yenidizi[i] === 8) {
            yenidizi[i] = (initialDegisen >> bitIndex) & 1; // initialDegisen değerini alıp bitIndex ile kaydırarak kontrol dizisine yerleştiriyoruz
            bitIndex++;
        }
    }
    
    displayResults(yenidizi, dataArray);
    document.getElementById('resultsSection').style.display = 'block';
    if (processDataCount >= 2) { // processData 3 kez çağrıldıysa
        document.getElementById('errorCorrectionSection').style.display = 'block'; // Error Correction bölümünü görünür yap
    }
}

function displayResults(yenidizi, dataArray) {
    const results = document.getElementById('results');
    results.textContent = `Girilen Veri: ${dataArray.join(' ')}\n`; // dataArray eklendi
    results.textContent += `Hamming Code: ${yenidizi.join(' ')}\n\n`;

    getOnesIndices(yenidizi, yenidizi.length);
}

function getOnesIndices(dizi, n) {
    let onesCount = 0;
    let elde = 0;
    let degisen = 0;
    let duzelt = 0;

    const results = document.getElementById('results');
    results.textContent += "1'lerin indeksleri : ";

    if (firstRun <3) {
        for (let i = n - 1; i >= 0; i--) {
            if (dizi[i] === 1) {
                const value = n - i;
                if (value !== 1 && (value & (value - 1)) !== 0) {
                    results.textContent += `${value} `;
                    elde = value;
                    degisen ^= elde;
                    onesCount++;
                }
            }
        }
        initialDegisen = degisen;
        results.textContent += `\n1 bulunan basamakların xorlanması: ${degisen}\n`;
        results.textContent += `Check bitleri: `;
        printBinary(initialDegisen);
        firstRun++;
    } else {
        for (let i = n - 1; i >= 0; i--) {
            if (dizi[i] === 1) {
                const value = n - i;
                if (value !== 1 && (value & (value - 1)) !== 0) {
                    results.textContent += `${value} `;
                    elde = value;
                    degisen ^= elde;
                    onesCount++;
                    duzelt = initialDegisen ^ degisen;
                }
            }
        }

        results.textContent += `\n1 bulunan konumların xorlanması: ${degisen}\n`;
        results.textContent += `1'lerin xorlanması: `;
        printBinary(degisen);
        
        if (duzelt === 0) {
            results.textContent += `Check bit(${initialDegisen}) ve güncel 1 konumlarının xorlanması(${degisen}): ${duzelt}\n`;
            results.textContent += `Hata check bitlerin birinde yapılmıştır! `;

        } else {
            results.textContent += `Check bit(${initialDegisen}) ve güncel 1 konumlarının xorlanması(${degisen}): ${duzelt}\n`;
            results.textContent += `Düzeltilmesi gereken konum: `;
            printBinary(duzelt);
        }
        results.textContent += `\n-------------------------------------------\n`;
    }
}

function printBinary(num) {
    const results = document.getElementById('results');
    if (num === 0) {
        results.textContent += "0\n";
        return;
    }

    let binaryStr = "";
    for (let i = b - 1; i >= 0; i--) {
        const bit = (num >> i) & 1;
        binaryStr += bit;
    }
    results.textContent += `${binaryStr}\n`;
}

function correctError() {
    const errorIndex = document.getElementById('errorIndex').value;
    const results = document.getElementById('results');
    const yenidizi = results.textContent.split('\n')[1].split(': ')[1].split(' ').map(Number);
    const n = yenidizi.length;

    if (errorIndex > n || errorIndex < 1) {
        alert('Geçerli bir indeks girin.');
        return;
    }

    const index = n - errorIndex;
    yenidizi[index] = yenidizi[index] === 0 ? 1 : 0;

    results.textContent += `\nDeğiştirilmiş Veri Dizisi: ${yenidizi.join(' ')}\n`;
    getOnesIndices(yenidizi, n);
}

function resetPage() {
    document.getElementById('dataLength').value = '';
    document.getElementById('dataArray').value = '';
    document.getElementById('errorIndex').value = '';
    document.getElementById('results').textContent = '';
    document.getElementById('results2').textContent = '';
    document.getElementById('dataEntrySection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('errorCorrectionSection').style.display = 'none';
    initialDegisen = 0;
    firstRun = true;
    dataLength = 0;
}

document.getElementById('infoIcon').addEventListener('click', function() {
    document.getElementById('infoBox').classList.remove('hidden');
    document.getElementById('infoIcon').style.display = 'none';
});

document.getElementById('closeInfoBox').addEventListener('click', function() {
    document.getElementById('infoBox').classList.add('hidden');
    document.getElementById('infoIcon').style.display = 'flex';
});

