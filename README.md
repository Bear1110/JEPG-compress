# JEPG-compress
JEPG compress


# 執行方法
裝 node.js之後，打開cmd輸入
```node decode.js ```

# 檔案功能描述
| 檔案名稱 | 功用 |
| --  | -- |
| decode.js |	灰階的 decode檔案 |
 |encode.js	 |灰階的 encode檔案  |
 |decodeRGB.js |	彩色的 deocde檔案  |
 |encodeRGB.js	 |彩色的 encode檔案 |
 |FastDct.js |	DCT公式的轉換 |
 |PSNR.js | 	計算PSNR的檔案 |
 |table.js  |	儲存各種數字及通用function |
 |config.json |	儲存要使用到的QF值及要壓縮及算PSNR的檔案 |
 |shell.bat |	快速執行指令之檔案 |


# 作法大致說明

## 黑白
**灰階彩色皆使用Luminance 表格**
1.	讀進來的數字組成一個512*512的大矩陣
2.	把他切成壓縮所需的8*8
3.	把每一個8*8 的 block做 DCT轉換(記得要減去128)
4.	根據不同的 QF 除以Luminance表格
5.	之後四捨五入並且 zigzac 排列
6.	並且 每一個block的DC 使用 DPCM 表示法 (DIFF = DCi – DC i-1)
7.	進行AC的編碼
8.	寫入檔案
解碼就是這樣一個一個步驟解碼回去即可得到圖片

## 彩色
1.	先把 每一個RGB 轉換成 Y Cb Cr 公式使用 wiki百科的https://en.wikipedia.org/wiki/YCbCr
2.	因為 sub mapping 4 : 1 : 1  

### Y 跟灰階差不多故省略
### Cb

1.	一樣先組成512 * 512的Cb陣列，因為每四個像素只取一個，所以再組成 8 * 8 的block的時候，第一個取 0,0 第二個取 0,2 第三個取 0,4 … 0,16之後下一個取 2,0 下一個取 2,2 …2,16 以此類推 取到 8*8 的陣列。所以最後只有1024 個block
2.	所以其實後面的步驟跟灰階差不多，只是剩下1024 個block ，然後做一樣的步驟
**Cr 做跟上面Cb 一樣的動作**

解碼的時候資料依序是   **Y資料編碼，Cb資料編碼，Cr資料編碼**。
然後Y根本來的一樣解碼完之後。
Cb 要解碼完之後只有 256 * 256 的資料，要記得把她填回去 512 * 512


```
for(let i = 0 , j = 0, k = 0; i < len ; i++){//  8*8 1024 to 4096
    let square = squares[i]
    for(let m = 0; m < 8 ; m++){
        for(let n = 0; n < 8 ; n++){
            bigPicture[j][k+n*2][2] = square[m][n] //左上
            bigPicture[j][k+n*2+1][2] = square[m][n] //右上
            bigPicture[j+1][k+n*2][2] = square[m][n] //左下
            bigPicture[j+1][k+n*2+1][2] = square[m][n] //右下
        }
        j+=2
    }
    k+=16
    if(k == 512){
        k = 0
    }else{
        j -= 16
    }
}
```
bigPicture第三維的 [1] 儲存的是每個像素的 Cb 值，[0]就是儲存Y，[2]就是儲存Cr值。
最後再用剛剛wiki 的公式把她轉換回RGB即可。



# 如何看 .raw 檔案: 
裝完 IrfanView 之後
再去裝這個 
All PlugIns - 64-bit Windows Installer
即可檢視raw檔


## 最後 PSNR Table


下面數字依序是 Quality Factor (QF) /	Compressed file size (Byte)	/ PSNR


檔名: Rgb/Baboon.raw 786432Bytes

	90	153325	22.222097360707235
  
	80	103178	22.131571177105872
  
	50	57048	21.781865153395216
  
	20	31588	20.847708382693305
  
	10	25043	19.58340965240986
  
	5	23755	17.28706219882671


檔名: Rgb/Lena.raw 786432Bytes

	90	78698	30.377320999225024
  
	80	49757	29.777064275633123
  
	50	29129	28.254067522006746
  
	20	24346	26.265503114363714
  
	10	25125	23.467326906315066
  
	5	27363	20.525612338278002


檔名: Grey/Baboon.raw 262144 Bytes

	90	112486	34.85321896852324
  
	80	78062	31.29764030519855
  
	50	45131	27.484150192000616
  
	20	24787	24.78398213650358
  
	10	16848	22.97132537571935
  
	5	14309	20.89086741191901


檔名: Grey/Lena.raw 262144 Bytes

	90	57544	40.808844072131116
  
	80	37320	38.54595576420542
  
	50	21666	35.79289412542509
  
	20	16536	32.895565940337114
  
	10	16235	30.159128625371384
  
	5	17331	26.646372541149272
