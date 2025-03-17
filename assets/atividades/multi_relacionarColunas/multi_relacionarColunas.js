  // Função para embaralhar array (Fisher-Yates)
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Função para embaralhar itens nas colunas
        function shuffleItems(container) {
            const leftCol = container.querySelector('.left-col');
            const rightCol = container.querySelector('.right-col');
            
            // Embaralhar e reordenar itens da esquerda
            const leftItems = Array.from(leftCol.children);
            shuffle(leftItems);
            leftItems.forEach(item => leftCol.appendChild(item));
            
            // Embaralhar e reordenar itens da direita
            const rightItems = Array.from(rightCol.children);
            shuffle(rightItems);
            rightItems.forEach(item => rightCol.appendChild(item));
        }

        document.querySelectorAll('.match-container').forEach(container => {
            const pairs = JSON.parse(container.dataset.pairs);
            let leftItems = container.querySelectorAll('.left-col .match-item');
            let rightItems = container.querySelectorAll('.right-col .match-item');
            const feedback = container.querySelector('.feedback-rl');
            const retryBtn = container.querySelector('.retry-btn');
            
            // Embaralhar itens ao carregar
            shuffleItems(container);
            let selectedItem = null;

            // Atualizar a seleção de itens após embaralhar
            const updateItems = () => {
                leftItems = container.querySelectorAll('.left-col .match-item');
                rightItems = container.querySelectorAll('.right-col .match-item');
            };

            // Função para validar o par selecionado
            const validatePair = (item1, item2) => {
                const id1 = item1.dataset.id;
                const id2 = item2.dataset.id;

                // Verificar se o par existe em qualquer ordem
                const isCorrect = pairs.some(pair => 
                    (pair.left === id1 && pair.right === id2) ||
                    (pair.left === id2 && pair.right === id1)
                );

                return isCorrect;
            };

            // Seleção de itens
            const handleSelection = (item) => {
                if (item.classList.contains('correct')) return;

                if (!selectedItem) {
                    // Selecionar o primeiro item
                    selectedItem = item;
                    item.classList.add('selected');
                } else {
                    // Validar o par selecionado
                    const isCorrect = validatePair(selectedItem, item);

                    // Aplicar estilos
                    selectedItem.classList.add(isCorrect ? 'correct' : 'incorrect');
                    item.classList.add(isCorrect ? 'correct' : 'incorrect');
                    
                    // Feedback
                    feedback.textContent = isCorrect ? '✓ Correto!' : '✗ Incorreto!';
                    feedback.style.color = isCorrect ? 'green' : 'red';

                    // Resetar seleção
                    selectedItem.classList.remove('selected');
                    selectedItem = null;
                }
            };

            // Event listeners
            leftItems.forEach(item => {
                item.addEventListener('click', () => handleSelection(item));
            });

            rightItems.forEach(item => {
                item.addEventListener('click', () => handleSelection(item));
            });

            // Botão de tentar novamente
            retryBtn.addEventListener('click', () => {
                shuffleItems(container);
                updateItems();
                
                leftItems.forEach(item => {
                    item.classList.remove('selected', 'correct', 'incorrect');
                });
                rightItems.forEach(item => {
                    item.classList.remove('correct', 'incorrect');
                });
                feedback.textContent = '';
                selectedItem = null;
            });
        });