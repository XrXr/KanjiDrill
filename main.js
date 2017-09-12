(function () {
    let data = document.getElementById('kanji-data')
    let questions
    let current_idx = -1
    let shortlist = new Set()
    let key_input_sequence_pos = 0

    let start = (raw) => {
        questions = new_questions_set(raw)
        current_idx = -1
        renderNextQuestion()
    }

    start(data.textContent)

    let upload = document.getElementById('custom-file')
    upload.addEventListener('change', ev => {
        // We probably won't ever care but if the user selects two files
        // quickly in succession, it is possible to have the first file show up
        // in the end.
        if (ev.target.files.length === 0) return
        let promises = []

        for (let i = 0; i < ev.target.files.length; i++) {
            promises.push(new Promise((resolve, reject) => {
                let reader = new FileReader()
                reader.readAsArrayBuffer(ev.target.files[i])
                reader.onloadend = () => {
                    if (reader.readyState === FileReader.DONE) {
                        let array_buffer = reader.result
                        let decoder = new TextDecoder('utf-8')
                        let quiz_file_content = decoder.decode(array_buffer)
                        resolve(quiz_file_content)
                    } else {
                        reject()
                    }
                }
            }))
        }

        Promise.all(promises).then(results => {
            start(results.join('\n'))
        })
    })

    document.addEventListener('keydown', ev => {
        // console.log(ev)
        sequence_input(ev.key)
        if (ev.key == 'ArrowRight') {
            renderNextQuestion()
        } else if (ev.key == 'Home') {
            current_idx = 0
            renderNextQuestion()
        } else if (ev.key == 's') {
            // shortlist
            shortlist.add(current_question())
        } else if (ev.key == 'q') {
            // shortlist review
            for (let {answer, prompts} of shortlist) {
                console.log(`"${answer}" has prompts: ${prompts}`)
            }
        } else if (ev.key == 'h') {
            odai.textContent = current_question().prompts.toString()
        }
    })

    function current_question() {
        return questions[current_idx]
    }

    function new_questions_set(raw) {
        return shuffle(parse_questions(raw))
    }

    function parse_questions(raw) {
        let lines = raw.trim().split('\n')
        return lines
            .map(l => l.trim())
            .filter(l => l.length > 0)
            .map(l => l.split(/\s+/))
            .map(e => ({answer: e[0], prompts: shuffle(e.slice(1))}))
    }

    function renderNextQuestion() {
        let odai = document.getElementById('odai')
        if (current_idx == (questions.length - 1)) return
        current_idx++
        let { answer, prompts } = current_question();
        odai.textContent = prompts[0]
        key_input_sequence_pos = 0
    }

    function sequence_input(key) {
        let code = 'answer'
        if (code[key_input_sequence_pos] === key) {
            key_input_sequence_pos++
        } else {
            key_input_sequence_pos = 0
        }

        if (key_input_sequence_pos === code.length) {
            odai.textContent = current_question().answer
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
