import { useEffect, useState } from "react";
import "./index.scss"

const benefitsSlider = ({ tradeProfits }) => {
    const [index, setIndex] = useState(0);
    const [benefits, setBenefits] = useState([]);

    useEffect(() => {
        if (tradeProfits) {
            setBenefits(tradeProfits.length == 2 ?
                [
                    ...tradeProfits,
                    tradeProfits[0]
                ] : tradeProfits)
        }
    }, [index, tradeProfits]);


    useEffect(() => {
        let slider = setInterval(() => {
            if (benefits.length > 0)
                setIndex((index) => ((index + 1) % benefits.length));
        }, 3000);
        return () => clearInterval(slider);
    }, [benefits]);


    return (
        <div className="benefits-slider">
            <div>Saving on this trade
            {
                (benefits && benefits.length > 0)
                    ? (
                        <div className="benefits-slider-wrapper">

                            {benefits.map((benefit, benefitIndex) => {

                                const { exchange, benefitBtc, benefitPct } = benefit;

                                let position = "nextSlide";

                                if (benefitIndex === index) {
                                    position = "activeSlide";
                                } else if (
                                    benefitIndex === index - 1 ||
                                    (index === 0 && benefitIndex === benefits.length - 1)
                                ) {
                                    position = "lastSlide";
                                }

                                return (
                                    <div key={'item-key-' + benefitIndex} className={'slide-item ' + position}>
                                        <div className="exchange-name">{exchange}</div>
                                        <div className="benefit-prices">
                                            <span>+{benefitPct}%</span>
                                            <span>+{benefitBtc} USDT</span>
                                        </div>
                                    </div>
                                );

                            })}
                        // </div>
                    )
                    : (
                        <div className="empty-container">
                            <div className="w-full mx-auto">
                                <div className="p-4 text-sm text-gray-300 border rounded-lg bg-zinc-900 border-cyan-500/30">
                                    Enter an amount to see how much you could save by trading on Dexfin
                                </div>
                            </div>
                         </div>
                    )
            }
            </div>
        </div>
    );
}

export default benefitsSlider;
