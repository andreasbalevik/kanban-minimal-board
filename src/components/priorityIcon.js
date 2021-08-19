import { FaAngleDoubleUp, FaAngleDoubleDown, FaSortAmountUp,FaAngleUp,FaAngleDown, FaRegQuestionCircle } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

const PriorityIcon = ({priority}) => {

    const iconArray = {
        1: {
            icon: <FaAngleDoubleDown/>,
            color: 'red',
            hint: 'don`t do these!'
        },
        2: {
            icon: <FaAngleDown/>,
            color: 'red',
            hint: "low priority"
        },
        3: {
            icon: "",
            color: 'blue',
            hint: "no priority"
        },
        4: {
            icon: <FaAngleUp/>,
            color: 'green',
            hint: "medium priority"

        },
        5: {
            icon: <FaAngleDoubleUp/>,
            color: 'green',
            hint: "high priority"
        }
    }

    return (
        <i data-tip={iconArray[priority].hint} style={{color: iconArray[priority].color}}>
            <ReactTooltip/>
            {iconArray[priority].icon}
        </i>
    )
}

export default PriorityIcon;