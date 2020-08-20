import jwt from 'jsonwebtoken';

const keys = {
    session: {
        token_secret_local: `@a!B#c$D%e^F&g*H(i)J_k+L-m=N; 'o:P"q[R]s{T}u|V/w.X<y>Z?€~$¥`,
        secret: `¥~$?€>Z<y.X/w|V}u{T]s[R"q:P'o; =N-m+L_k)J(i*H&g^F%e$D#c!B@a`,
    },
}

export async function createNewToken(userid) {
    var signedNewToken = jwt.sign(
        { sub: userid, iss: "up4me" },
        keys.session.token_secret_local
    );
    return "Bearer " + signedNewToken;
}    