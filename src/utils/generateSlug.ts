export function generateSlug (text: string): string {
    return text
        .normalize("NFD") //normalização, transforma letras com símbolos em letras e simbolos
        .replace(/[\u0300-\u036f]/g, "") //substitue todos os acentos por ""
        .toLowerCase() 
        .replace(/[^\w\s-]/g, "") //substitue qualquer símbolo que não seja letra por ""
        .replace(/\s+/g, "-"); //se ouverem multiplos espaçoes em branco se coloca um hífen
}