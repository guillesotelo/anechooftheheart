import React, { HTMLProps } from 'react';
import ReactSlider from "react-slider";

interface SliderProps {
    value: number;
    name: string;
    type: string;
    setValue: (value: number) => void;
    label?: string;
    setIsEdit?: (value: boolean) => void;
    onChangeSettings?: (type: string, name: string, value: number) => void;
    style?: React.CSSProperties;
    min?: number;
    max?: number;
    marks?: number;
    step?: number;
    sign?: string;
}

export default function Slider(props: SliderProps) {
    const {
        value,
        name,
        type,
        setValue,
        label,
        setIsEdit,
        onChangeSettings,
        style,
        min,
        max,
        marks,
        step,
        sign
    } = props;

    const handleChange = (newValue: number) => {
        if (onChangeSettings) {
            onChangeSettings(type, name, newValue);
        } else {
            setValue(newValue);
        }

        if (setIsEdit) {
            setIsEdit(true);
        }
    };

    const renderMark = (props: HTMLProps<HTMLSpanElement>) => {
        if (Number(props.key) < value) {
            props.className = "custom-slider__mark custom-slider__mark-before";
        } else if (props.key === value) {
            props.className = "custom-slider__mark custom-slider__mark-active";
        }
        return <span {...props} />;
    };

    return (
        <div className='slider-container' style={style}>
            {label && <h4 className='slider-label'>{label || ''}</h4>}
            <div className='slider-row'>
                <ReactSlider
                    className="custom-slider"
                    thumbClassName="custom-slider__thumb"
                    trackClassName="custom-slider__track"
                    markClassName="custom-slider__mark"
                    marks={marks || 0}
                    step={step}
                    min={min || 0}
                    max={max || 100}
                    defaultValue={0}
                    value={value || 0}
                    onChange={(newValue: number) => handleChange(newValue)}
                    renderMark={renderMark}
                />
                <h4 className='slider-thumb'>{`${value}${sign || ''}`}</h4>
            </div>
        </div>
    );
}
