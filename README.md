# rinha-de-compiler-ts
Interpretador capenga escrito em TypeScript para a Rinha de Compiler

## Para executar
Construa a imagem docker
```
docker build -t rinha-ts .
```

Execute com o caso de teste
```bash
docker run rinha-ts
```

ou especifique um arquivo
```bash
docker run rinha-ts -v [./arquivo.rinha.json]:/var/rinha/source.rinha.json
```
