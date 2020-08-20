export const resizeImage = (img, width, ratio) => {

    var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        oc = document.createElement("canvas"),
        octx = oc.getContext("2d");

    canvas.width = width;
    canvas.height = canvas.width * img.height / img.width;

    var cur = {
        width: Math.floor(img.width * 0.5),
        height: Math.floor(img.height * 0.5)
    }

    oc.width = cur.width;
    oc.height = cur.height;

    octx.drawImage(img, 0, 0, cur.width, cur.height);

    while (cur.width * 0.5 > width) {
        cur = {
            width: Math.floor(cur.width * 0.5),
            height: Math.floor(cur.height * 0.5)
        };
        octx.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
    }

    ctx.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height);

    const result = canvas.toDataURL("image/jpeg", ratio);

    console.log(result);

    return result;
}