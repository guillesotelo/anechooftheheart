"use client"

import { useContext } from "react"
import { AppContext } from "src/app/context/AppContext"

export default function renderValues() {
    const { isMobile } = useContext(AppContext)

    return (
        <div className="bespoken__container">
            <div className="page__header">
                <h1 className="page__header-title">Values</h1>
            </div>
            <div className="bespoken__row">
                <div className="bespoken__col" style={{ width: '80vw' }}>
                    <p className="bespoken__text" style={{ textAlign: isMobile ? 'left' : 'justify' }}>
                        <strong>I DREAM</strong> of a business where I can express my work in my best way and people can find confidence, detail, excellence and purpose in what they are doing and receiving.
                        <br />
                        <br />
                        <strong>LIFE VALUES</strong> are implied in the product itself and the human relationship that is built behind it. A caring, living and sustainable environment.
                        <br />
                        <br />
                        <strong>CONFI TUNES</strong> may accompany your workplace, coffee, creativity moments and conversations.
                        <br />
                        <br />
                        <strong>BREATH IN DEEPLY & EXHALE SLOWLY</strong> as you move on in your day, because you understand the value of your mind and body as your only vehicle in life. That is your precious production machine.
                        <br />
                        <br />
                        <strong>TRUTHFUL & HONEST</strong> work habits will make it a transparent & good workplace to be.
                        <br />
                        <br />
                        <strong>APPRECIATIVE AND KING LANGUAGE</strong> become pillars of conversations and communication with everyone.
                        <br />
                        <br />
                        <strong>SERVING ONE ANOTHER</strong> with respect, care and love create the product itself.
                        <br />
                        <br />
                        <strong>BE GRACEFUL & COMPASSIONATE</strong> means to give a second chance from your heart. All humans can make mistakes.
                        <br />
                        <br />
                        <strong>YOU CAN FIND A QUIET ROOM</strong> in a garden, a couch or a terrace, where you can converse or think if you need it.
                        <br />
                        <br />
                        <strong>GROWTH GOES IS HAND WITH EVERYTHING THAT YOU DO</strong> Care for your family, your friends, your job & for you.
                        <br />
                        <br />
                        <strong>PURSUIT YOUR PERSONAL TALENTS</strong> your uniqueness, abilities & capacities. Accompany them with a higher thinking of gratitude.
                        <br />
                        <br />
                        <strong>THIS IS A PLACE FOR ABUNDANCE & GIVING</strong> for sharing and growing.
                        <br />
                        <br />
                        That this part of your lifetime might be truly gratifying, edifying and nurturing to your soul!
                    </p>
                </div>
            </div>
        </div>
    )
}