//////////////////////////////////////////////////////
// Cacheing 
//////////////////////////////////////////////////////

const fs = require('fs')
const resolve = require('path').resolve;

DIR1 = 'cache'
DIR2 = 'index'

function hasCachedCombos(fname) {
    return fs.existsSync(resolve(DIR1, DIR2, fname))
}

function fetchCachedCombos(fname) {
    const data = fs.readFileSync(resolve(DIR1, DIR2, fname))
    return JSON.parse(data).combos;
}

function cacheCombos(combos, fname) {
    const fileData = JSON.stringify({ combos: combos })

    const dir1 = resolve(DIR1)
    if (!fs.existsSync(dir1)){
        fs.mkdirSync(dir1);
    }
    const dir2 = resolve(DIR1, DIR2)
    if (!fs.existsSync(dir2)){
        fs.mkdirSync(dir2);
    }
    fs.writeFileSync(resolve(DIR1, DIR2, fname), fileData, err => {
        if (err) {
            console.error(err)
        }
    })
}

function getLastCacheModified(fname) {
    return fs.statSync(resolve(DIR1, DIR2, fname)).mtime
}

//////////////////////////////////////////////////////
// Parsing 
//////////////////////////////////////////////////////

// Parses the map notes by splitting on comma and colon to get the map+person+link
function parseMapNotes(notes) {
    if (!notes) return {};
    return Object.fromEntries(
        notes
            .trim()
            .split('\n')
            .map((n) => {
                let altmap, altperson, altbitly;
                [altmap, altperson, altbitly] = n
                    .split(/[,:]/)
                    .map((t) => t.replace(/ /g, ''));

                return [
                    altmap,
                    {
                        PERSON: altperson,
                        LINK: `[${altbitly}](http://${altbitly})`,
                    },
                ];
            })
    );
}

module.exports = {
    hasCachedCombos,
    fetchCachedCombos,
    cacheCombos,
    getLastCacheModified,

    parseMapNotes,
}