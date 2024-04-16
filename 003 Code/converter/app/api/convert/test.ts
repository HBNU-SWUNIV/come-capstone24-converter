import pdf2img from "pdf-img-convert";
export const Convert = async (pdf_file) => {
  try{
    if(pdf_file.length === 0){
        throw new Error('error_convert_length_zero!');
    }
    
    const pdfOutput = await pdf2img.convert(pdf_file);
    return pdfOutput;
  }catch (error){
    console.error('PDF를 PNG로 변환하는 중 오류 발생:');
    throw error;
  }
};
