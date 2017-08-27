(function () {
    let data = document.getElementById('kanji-data')
    let lines = data.textContent.trim().split('\n')
    console.log(lines)
    let mapping = new Map(
        lines
            .map(l => l.trim().split(/\s+/))
            .map(e => [e[0], e.slice(1)])
    )

    for (let [kanji, readings] of mapping) {
        console.log(`"${kanji}" has readings: ${readings}`)
    }

    let odai = document.getElementById('odai')
    let it = mapping[Symbol.iterator]()
    let {value: [kanji, readings], done} = it.next()
    odai.textContent = readings[0]
})()
