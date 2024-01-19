"use strict";
let groenten;
leesGroenten();

async function leesGroenten() {
    const response = await fetch("javascript/groenten.json");
    if(response.ok) {
        groenten = await response.json();
        document.getElementById("groentenProbleem").hidden = true;
        const select = document.getElementById("groente");
        for(const groente of groenten) {
            const option = document.createElement("option");
            option.value = groente.naam;
            option.innerText = `${groente.naam} ${groente.prijs}/${groente.eenheid}`;
            select.appendChild(option);
        }
    }
    else {
        document.getElementById("groentenProbleem").hidden = false;
    }
}

document.getElementById("toevoegen").onclick = function() {
    const verkeerdeElementen = document.querySelectorAll("input:invalid, select:invalid");
    for(const element of verkeerdeElementen) {
        document.getElementById(`${element.id}Fout`).hidden = false;
    }
    const correcteElementen = document.querySelectorAll("input:valid, select:valid");
    for(const element of correcteElementen) {
        document.getElementById(`${element.id}Fout`).hidden = true;
    }
    if(verkeerdeElementen.length === 0) {
        werkMandjeBij(groenten[document.getElementById("groente").selectedIndex - 1], Number(document.getElementById("aantal").value));
    }
}

function werkMandjeBij(groente, aantal) {
    const trMetDezeGroente = document.getElementById(`${groente.naam}Rij`)
    if(trMetDezeGroente === null) {
        voegGroenteToeAanMandje(groente, aantal);
    }
    else {
        wijzigRijInMandje(trMetDezeGroente, aantal);
    }
}

function voegGroenteToeAanMandje(groente, aantal) {
    document.querySelector("table").hidden = false;
    const tr = document.querySelector("tbody").insertRow();
    tr.id = `${groente.naam}Rij`
    tr.insertCell().innerText = groente.naam;
    tr.insertCell().innerText = aantal;
    tr.insertCell().innerText = groente.prijs;
    const teBetalen = Number((aantal * groente.prijs).toFixed(2));
    tr.insertCell().innerText = teBetalen;
    const img = document.createElement("img");
    img.src = "images/vuilbak.png";
    img.alt = "vuilbak";
    const hyperlink = document.createElement("a");
    hyperlink.appendChild(img);
    hyperlink.href = "#";
    hyperlink.onclick = function() {
        const teVerwijderenTr = this.parentElement.parentElement;
        verlaagTotaalMet(Number(teVerwijderenTr.cells[3].innerText));
        teVerwijderenTr.remove();
    }
    tr.insertCell().appendChild(hyperlink);
    verhoogTotaalMet(teBetalen);
}

function wijzigRijInMandje(tr, aantal) {
    tr.cells[1].innerText = Number(tr.cells[1].innerText) + aantal;
    const extraTeBetalen = Number(Number((tr.cells[2].innerText) * aantal).toFixed(2));
    tr.cells[3].innerText = (Number(tr.cells[3].innerText) + extraTeBetalen).toFixed(2);
    verhoogTotaalMet(extraTeBetalen);
}

function verhoogTotaalMet(bedrag) {
    const totaalTd = document.getElementById("totaal");
    totaalTd.innerText = (Number(totaalTd.innerText) + bedrag).toFixed(2);
}

function verlaagTotaalMet(bedrag) {
    const totaalTd = document.getElementById("totaal");
    totaalTd.innerText = (Number(totaalTd.innerText) - bedrag).toFixed(2);
}