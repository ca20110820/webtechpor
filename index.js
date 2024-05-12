// import('./card.js').then(module => {
//     // Use module.default to access the default export
//     // Use module.someFunction to access named exports
//
//     const CustomCard = customElements.get('custom-card');
//     console.log(CustomCard);
//
//     let cardContainer = document.querySelector('#card-container');
//
//     for (let i = 1; i < 5; i++) {
//         let card = new CustomCard(i);
//         cardContainer.appendChild(card);
//     }
// })
// .catch(error => {
//     console.error(error);
// });