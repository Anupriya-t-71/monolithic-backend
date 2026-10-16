import puppeteer from "puppeteer"
import path from "path"


export const HTMLtoPDF = async(htmlContent,outputPath)=>{
    try {
        const dirname = path.resolve()
        const exportPath = path.join(dirname,'public','ExportPdf',`${outputPath}.pdf`)
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.setContent(htmlContent)

        await page.pdf({path:exportPath,
            format:'A4',
            landscape:true,
            printBackground:true,
        })

        await browser.close()
    } catch (error) {
        console.log("puppter error:",error)
    }
}