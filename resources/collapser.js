let collapsables = document.getElementsByClassName("collapse");

for (let collapse of collapsables)
{
    let target = collapse.parentElement.parentElement.childNodes[1];
    let isHidden = target.style.display === 'none';
    let clickTarget = collapse.parentElement;

    setIcon(collapse, !isHidden);
    
    clickTarget.addEventListener("click", () => toggleCollapse(collapse));
}

let toggleAll = document.getElementsByClassName("toggleAll")[0];
toggleAll.addEventListener("click", function()
{
    for (let collapse of collapsables)
    {
        toggleCollapse(collapse);
    }
});

function toggleCollapse(collapse)
{
    let target = collapse.parentElement.parentElement.childNodes[1];
    let isHidden = target.style.display === 'none';

    target.style.display = isHidden ? '' : 'none';
    setIcon(collapse, isHidden);
}
    
function setIcon(collapse, isHidden)
{
    collapse.innerHTML = isHidden ? '&#9650;' : '&#9660;';
}