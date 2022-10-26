import styles from './Button.module.css';

const Button = (props: any) => {

    let styleClass;

    if(props.priority === "lower"){
        styleClass = styles.lowerPriorityButton
    }
    else if(props.priority === "low"){
        styleClass = styles.lowPriorityButton
    }
    else if (props.priority === "mid"){
        styleClass = styles.midPriorityButton
    }
    else{
        styleClass = styles.highPriorityButton
    }

    return (
            <div className = {styles.divButton}>
                <button
                    onClick = {props.onClick}
                    className = {styleClass}
                    >
                    {props.children}
                </button>
            </div>
    );
}

export default Button;
