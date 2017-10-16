export default interface IFormatProvider
{
    date: Date;
    formatToHtml(): string;
}