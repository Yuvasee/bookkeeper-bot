export function transaction(t) {
    let tStr = `<b>Transaction: -${t.get('sum')} ${t.get('currency')}</b>`;
    tStr += `\ndate: ${t.get('date').toDateString()}`;
    tStr += `\nactor: ${t.get('actor')}`;
    tStr += `\ncategory: ${t.get('category')}`;
    tStr += `\ntags: ${t.get('tags').join(', ')}`;
    tStr += `\ndescription: ${t.get('description')}`;
    return tStr;
}
