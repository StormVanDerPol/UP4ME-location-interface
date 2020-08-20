import jwt from 'jsonwebtoken';

const keys = {
    session: {
        token_secret_local: `***REMOVED***`,
        secret: `***REMOVED***`,
    },
}

export async function createNewToken(userid) {
    var signedNewToken = jwt.sign(
        { sub: userid, iss: "up4me" },
        keys.session.token_secret_local
    );
    return "Bearer " + signedNewToken;
}    