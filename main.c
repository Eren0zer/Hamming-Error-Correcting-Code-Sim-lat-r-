#include <stdio.h>
#include <stdlib.h>
#include <math.h>


int b ;
int kontrol[];

void printBinary(int num) {
    int kontrolbitleri[b];
    if (num == 0) {
        printf("0");
        return;
    }

    // Sayıyı binary olarak yazdır
    for (int i = b-1 ; i >= 0; i--) {
        int bit = (num >> i) & 1;
        printf("%d", bit);
        kontrolbitleri[i] = bit;
        kontrol[i]= kontrolbitleri[i];
    }

}

void getOnesIndices(int dizi[], int n) {
    printf("1'lerin indeksleri (ikili olarak): ");

    static int onesCount = 0; // 1'lerin sayısını tutacak değişken
    static int elde = 0;
    static int degisen = 0;
    static int firstRun = 1; // İlk çalıştırmayı kontrol edecek değişken
    static int initialDegisen = 0; // İlk çalıştırmada çıkan binary değeri saklayacak değişken
    static int duzelt = 0;

    if (firstRun == 1) {
        // İlk çalıştırmada verileri hesaplayıp sakla
        for (int i = n - 1; i >= 0; i--) {
            if (dizi[i] == 1) {
                int value = n - i;
                if (value != 1 && (value & (value - 1)) != 0) { // 1 ve 2'nin kuvvetlerini atlamak için
                    printf("%d ", value);
                    elde = value;
                    degisen = degisen ^ elde;
                    onesCount++; // 1'lerin sayısını artır
                }
            }
        }
        initialDegisen = degisen; // İlk çalıştırmada çıkan binary değeri sakla
         // İlk çalıştırmanın tamamlandığını belirt
    } else {
        degisen = 0;
        // İkinci ve sonraki çalıştırmalarda normal devam et
        for (int i = n - 1; i >= 0; i--) {
            if (dizi[i] == 1) {
                int value = n - i;
                if (value != 1 && (value & (value - 1)) != 0) { // 1 ve 2'nin kuvvetlerini atlamak için
                    printf("%d ", value);
                    elde = value;
                    degisen = degisen ^ elde;
                    onesCount++; // 1'lerin sayısını artır
                    duzelt = initialDegisen ^ degisen;

                }
            }
        }


    }

    printf("\n");
    printf("Basamaklarin xorlanmasi %d\n", degisen);
    if (firstRun) {
        printf("Initial degisen: ");
        printBinary(initialDegisen); // İlk çalıştırmada saklanan değeri yazdır
        firstRun = 0;
    } else if (firstRun != 1 ) {
        printf("guncel 1 konumlarinin xor degerinin binary hali : ");
        printBinary(degisen); // Mevcut değeri yazdır
        printf("\n");
        // duzelt değerini ve binary halini yazdır
        printf("-------------------------------------------\n");
        if(duzelt ==0){
            printf("check bit(%d) ve güncel 1 konumlarinin xorlanması(%d): %d\n",initialDegisen ,degisen,duzelt);
            printf("Degisim check bitlerde yapildigi icin hata bulunamadi: ");
            printBinary(duzelt);
        } else {
            printf("check bit(%d) ve güncel 1 konumlarinin xorlanması(%d): %d\n",initialDegisen ,degisen,duzelt);
            printf("Duzeltilmesi gereken konum: ");
            printBinary(duzelt);
        }


    }
    printf("\n");
}

int main() {
    int m = 0;

    while (1) {
        printf("verinin uzunlugunu girin: ");
        scanf("%d", &m);

        if (m > 0) // Geçerli bir deðer girildiðinden emin olun
            break;
        else
            printf("Hata: Geçerli bir veri uzunluðu girin.\n");
    }

    int dizi[m];
    printf("Lutfen %d adet 0 veya 1 girin (0 veya 1 arasinda bosluk birakarak): ", m);

    // Kullanýcýdan dizi elemanlarýný al
    for (int i = 0; i < m; i++) {
        scanf("%d", &dizi[i]);
    }

    // Kullanýcýnýn girdiði diziyi ekrana bas
    printf("Girilen dizi: ");
    for (int i = 0; i < m; i++) {
        printf("%d ", dizi[i]);
    }
    printf("\n");

    int r = 0;
    for (r = 0; r <= m; r++) {
        if (m + r + 1 <= pow(2, r)) {
            printf("parity bit degeri: %d\n", r);
            b = r;
            break;
        }
    }
    int n = m + r;
    int yenidizi[n]; // Karakter türünde tanýmlandý

    int i, j;
    for (i = 0, j = 0; i < n; i++) {
        if ((i + 1) == (1 << j)) { // 2^n-1 konumlarý kontrol edin
            yenidizi[n - 1 - i] = 8; // Karakter olarak 'x' atandý, x'lerin sağ tarafta olması için indeksler ters sıra ile atanıyor
            j++;
        } else {
            yenidizi[n - 1 - i] = dizi[m - 1 - (i - j)] + 0; // ASCII deðeri olarak deðil, karakter olarak atandý, x'lerin sağ tarafta olması için indeksler ters sıra ile atanıyor
        }
    }

    // 12 bitlik diziyi yazdýrýn
    printf("yeni Bitlik Dizi: ");
    for (i = 0; i < n; i++) {
        printf("%d ", yenidizi[i]);
    }
    printf("\n");
    getOnesIndices(yenidizi, n);

    int x, y;
    int veridizisi[n];
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
    //verinin tam hali
    printf("veri Bitlik Dizi: ");
    for (i = 0; i < n; i++) {
        printf("%d ", veridizisi[i]);
    }
    printf("\n");
    int hata = 0;
    printf("hangi satirdaki veriyi degistirmek istiyorsunuz(sagdan sola sayiniz (1den basla)):");
    scanf("%d", &hata);

    int index = n - hata; // Kullanıcı sağdan sola saydığı için indeksi yeniden hesapla

    if (veridizisi[index] == 0) {
        veridizisi[index] = 1;
        printf("degistirilmis Bitlik Dizi: ");
        for (i = 0; i < n; i++) {
            printf("%d ", veridizisi[i]);
        }
    } else if (veridizisi[index] == 1) {
        veridizisi[index] = 0;
        printf("degistirilmis Bitlik Dizi: ");
        for (i = 0; i < n; i++) {
            printf("%d ", veridizisi[i]);
        }
    }
    printf("\n");
    getOnesIndices(veridizisi, n);
    printf("\n");

    return 0;
}
