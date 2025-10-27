export function random(len: number){
    const ooljalool = "qwertyasdfgzxcvb1234";
    const length = ooljalool.length;

    let ans = "";

    for(let i = 0; i < len; i++){
        ans += ooljalool[Math.floor(Math.random() * length)];
    }
    return ans;
}