export default interface ICommand {
    re: RegExp;
    cb: (ctx: any, next: any) => void;
}
