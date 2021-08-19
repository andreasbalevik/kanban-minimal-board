import { FaAngleDoubleUp, FaAngleDoubleDown, FaSortAmountUp } from 'react-icons/fa';

const PriorityIcon = ({priority}) => {

    if(priority > 3){
        return (
        <i style={{color: 'green'}}>
            <FaAngleDoubleUp/>
        </i>
        )
    } else if (priority < 3){
        return (
        <i style={{color:'red'}}>
            <FaAngleDoubleDown/>
        </i>
        )
    } else {
        return (
        <label></label>
        )
    }

}

export default PriorityIcon;