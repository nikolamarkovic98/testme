const redirectHome = (e, history, taskCompleted) => {
    e.preventDefault();
    if(taskCompleted)
        history.push('/');
    else if(window.confirm('Are you sure you want to cancel? Any progress will be unsaved.'))
        history.push('/');
}

const displayMessage = (id, msg, color) => {
    const p = document.querySelector(`#${id}`);
    p.style.color = color;
    p.innerHTML = msg;
}

const createStr = str => {
    let newStr = '';
    for(let i = 0; i < str.length; i++){
        if(str[i]==='\"'){
            newStr+='|';
            continue;
        }
        newStr+=str[i];
    }
    return newStr;
}

const getDate = _date => {
    const date = new Date(_date);
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
}

export {
    redirectHome,
    displayMessage,
    createStr,
    getDate
}