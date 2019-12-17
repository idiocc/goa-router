## Wiki

The wiki submodule has been created for convenient access to the wiki git. The documentation from `documentary-wiki` folder will be compiled into the `wiki` dir, after which changes must be pushed into both places. _Documentary_ can automatically watch updates to the source files, add them to the submodule, and push changes:

```sh
yarn wiki -p 'commit message'
```

%~%