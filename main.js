(function () {
    let data = document.getElementById('kanji-data')
    let lines = data.textContent.trim().split('\n')
    let questions = lines
        .map(l => l.trim().split(/\s+/))
        .map(e => ({kanji: e[0], readings: e.slice(1)}))

    let shuffled_questions = Array(questions.length)
    for (let q of questions) {
        while (true) {
            let seat = Math.trunc(Math.random() * questions.length)
            if (shuffled_questions[seat] === undefined) {
                shuffled_questions[seat] = q
                break
            }
        }
    }

    questions = shuffled_questions

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
})()
