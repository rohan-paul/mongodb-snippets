This repo is primarily to be used as a reference. Its a collection of some small MongoDB Snippets required on a daily basis.

Each of the project here has its own README.md file detailing how to launch the project and the job achieved with that project.

---

### Mongo Shell Enhancements with Mongo-Hacker

I highly recommend to install Mongo-Hacker. It provides neat enhancements for the Mongo Shell like syntax coloring and formatting by default (no need to append .pretty() anymore). There is much more to discover; just check out the documentation.

---

### fzf-Powered Shell History Search

```
sudo apt-get install fzf

```

[fzf](https://github.com/junegunn/fzf) is a really awesome command line tool for fuzzy-searching things like files and folders. But for me, the most powerful feature of fzf is to apply the fuzzy search to the shell history (via key bindings). When it comes to MongoDB, I use the fuzzy history search to quickly find the required mongo connection line to connect to a certain database. Just hit Ctrl-R and type “mongo databaseName/username/appName”.

![](assets/fzf-mongo-find-connection-string.gif)

**Needless to say, that you should encrypt your disk when having passwords in the shell history file.**
