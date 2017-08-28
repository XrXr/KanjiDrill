(function () {
    let data = document.getElementById('kanji-data')
    let lines = data.textContent.trim().split('\n')
    let questions = lines
        .map(l => l.trim().split(/\s+/))
        .map(e => ({kanji: e[0], readings: shuffle(e.slice(1))}))

    questions = shuffle(questions)

    let it = questions[Symbol.iterator]()
    let current_question
    let shortlist = new Set()
    let sequence_pos = 0
    renderNextQuestion()

    document.addEventListener('keydown', ev => {
        // console.log(ev)
        sequence_input(ev.key)
        if (ev.key == 'ArrowRight') {
            renderNextQuestion()
        } else if (ev.key == 'Home') {
            it = questions[Symbol.iterator]()
            renderNextQuestion()
        } else if (ev.key == 's') {
            // shortlist
            shortlist.add(current_question)
        } else if (ev.key == 'q') {
            // shortlist review
            for (let [kanji, readings] of shortlist) {
                console.log(`"${kanji}" has readings: ${readings}`)
            }
        } else if (ev.key == 'h') {
            odai.textContent = current_question.readings.toString()
        }
    })

    function renderNextQuestion() {
        let odai = document.getElementById('odai')
        let {value, done} = it.next()
        if (done) return
        current_question = value
        let { kanji, readings } = value;
        odai.textContent = readings[0]
        sequence_pos = 0
    }

    function sequence_input(key) {
        let code = 'answer'
        if (code[sequence_pos] === key) {
            sequence_pos++
        } else {
            sequence_pos = 0
        }

        if (sequence_pos === code.length) {
            odai.textContent = current_question.kanji
        }
    }

    function shuffle(arr) {
        // Fisher-Yates-Durstenfeld
        let untouched = arr.length
        while (untouched > 0) {
            let swapee = Math.round(Math.random() * (untouched - 1))
            let last_idx = untouched - 1;
            let temp = arr[swapee]
            arr[swapee] = arr[last_idx]
            arr[last_idx] = temp
            untouched--
        }
        return arr
    }
})()
