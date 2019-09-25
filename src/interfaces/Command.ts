export default interface Command {
    re: RegExp;
    cb: (ctx: any, next: any) => void;
}
