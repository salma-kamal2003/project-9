let audio = document.querySelector(".quranPlayer"),
    surahsContainer = document.querySelector(".surahs"),
    ayah = document.querySelector(".ayah"),
    next = document.querySelector(".next"),
    play = document.querySelector(".play"),
    prev = document.querySelector(".prev");


getSurahs()

function getSurahs() {
    fetch(' https://api.quran.gading.dev/surah')
        .then(response => response.json())
        .then(data => {
            for (let surah in data.data) {
                surahsContainer.innerHTML += `
                <div>
                <p>${data.data[surah].name.long}</p>
                <p>${data.data[surah].name.transliteration.en}</p>
                </div>
                `
            }

            // select all surahs

            let allSurahs = document.querySelectorAll(".surahs div"),
                AyahsAudios,
                AyahsText;
            allSurahs.forEach((surah, index) => {
                surah.addEventListener("click", () => {
                    fetch(` https://api.quran.gading.dev/surah/${index + 1}`)
                        .then(response => response.json())
                        .then(data => {

                            let verses = data.data.verses

                            AyahsAudios = []

                            AyahsText = []

                            verses.forEach(verse => {

                                AyahsAudios.push(verse.audio.primary)

                                AyahsText.push(verse.text.arab)

                            })

                            let ayatIndex = 0;

                            changeAyah(ayatIndex)
                            audio.addEventListener("ended", () => {
                                ayatIndex++;
                                if (ayatIndex < AyahsAudios.length) {
                                    changeAyah(ayatIndex)
                                }
                                else {

                                    ayatIndex = 0;

                                    changeAyah(ayatIndex)

                                    audio.pause()

                                    swal("Good job!", "surah has been Ended!", "success");

                                }
                                isPlaying = true;
                                togglePlay()
                            })

                            // Handle Next and Prev

                            next.addEventListener("click" ,() => {
                                ayatIndex < AyahsAudios.length-1 ? ayatIndex++ : ayatIndex =0

                                changeAyah(ayatIndex)
                            })

                            prev.addEventListener("click" ,() => {
                                ayatIndex == 0 ? ayatIndex =AyahsAudios.length -1 : ayatIndex --;
                                changeAyah(ayatIndex)
                            })
                            // Handle play Button

                            let isPlaying = false;
                            togglePlay()
                            function togglePlay() {

                                if (isPlaying){

                                    audio.pause();
                                    play.innerHTML = `<i class ="fas fa-play"></i>`
                                    isPlaying = false;
                                }
                                else{

                                    audio.play();
                                    play.innerHTML = `<i class = "fas fa-pause"></i>`
                                    isPlaying = true

                                }
                            }
                            play.addEventListener("click" , togglePlay)


                            function changeAyah(index) {
                                audio.src = AyahsAudios[index]

                                ayah.innerHTML = AyahsText[index]

                            }

                        })
                })
            })
        })
}
