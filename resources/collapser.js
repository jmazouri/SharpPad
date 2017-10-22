let collapsables = document.getElementsByClassName("collapse");

for (let collapse of collapsables)
{   
    let clickTarget = collapse.parentElement;
    let isHidden = clickTarget.parentElement.classList.contains('hidden');

    setIcon(collapse, !isHidden);
    
    clickTarget.addEventListener("click", () => changeVisibility(collapse));
}

let collapseAll = document.getElementById("collapseAll");
collapseAll.addEventListener("click", function()
{
    for (let collapse of collapsables)
    {
        changeVisibility(collapse, false);
    }
});

let expandAll = document.getElementById("expandAll");
expandAll.addEventListener("click", function()
{
    for (let collapse of collapsables)
    {
        changeVisibility(collapse, true);
    }
});

function changeVisibility(collapse, visible)
{
    let target = collapse.parentElement.parentElement;

    if (visible == undefined)
    {
        visible = target.classList.contains('hidden');
    }
    
    if (visible)
    {
        target.classList.remove('hidden');
    }
    else
    {
        target.classList.add('hidden');
    }

    setIcon(collapse, visible);
}

function setIcon(collapse, isHidden)
{
    collapse.innerHTML = isHidden ? '&#9650;' : '&#9660;';
}