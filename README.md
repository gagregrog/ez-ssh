# ez-ssh

A super-simple command line interface for handling ssh into a remote machine.

```bash
$ ez-ssh <alias> [options]
```

## Installation

Install globally with npm.

```bash
$ npm i -g ez-ssh
```

## Features

  * Easily add/manage ssh aliases to a remote host
  * Setup via flags, an interactive wizard, or store a full command
  * List or remove aliases

## Usage

Use the keyword `ez-ssh` and provide an alias.

If you are adding a new alias, simply provide the needed flags and values.

To call a previously stored alias, simply type `ez-ssh <alias>`.

### Options

  * `-w`, `--wizard`     Use the interactive wizard to create your alias.
  * `-n`, `--name`       The name used to identify the alias. This is the default entry, no flag is required.
  * `-a`, `--address`    The address of the host machine to ssh into.
  * `-i`, `--identity`   The name of an identity file stored in `~/.ssh`, or an absolute path to the file.
  * `-u`, `--user`       The name of the user to login with. Defaults to ubuntu.
  * `-p`, `--port`       A specific port to ssh into.
  * `-r`, `--remote`     Whether to add support for Remote VSCode editor on port 52698.
  * `-c`, `--complete`   A complete ssh command to store (excluding the initial "ssh") wrapped in quotes.
  * `-d`, `--delete`     Delete a stored alias.
  * `-l`, `--list`       List the saved aliases. Also accessible by `ez-ssh ls`.
  * `-v`, `--verbose`    When listing aliases, use the verbose flag to show the value each alias maps to.
  * `-h`, `--help`       Display this usage guide.

### Reserved Words

You cannot set an alias for the following values.

  * `ls` - List aliases
  * `lsv` - List aliases and the command they map to
  * `h`, `help` - Show the usage guide

## Examples

**1. Basic**

*Input*:  `$ ez-ssh ec2 -i my_aws_pem.pem -a ec2-14-125-321-552.compute-1.amazonaws.com`


*Result:* `ssh -i ~/.ssh/my_aws_pem.pem ubuntu@ec2-14-125-321-552.compute-1.amazonaws.com`

*Usage:*  `$ ez-ssh ec2`
    
**2. Local**      

*Input:*  `$ ez-ssh pi -a raspberryPi.local -u pi -p 1776`

*Result:* `ssh pi@raspberryPi.local -p 1776`           

*Usage:*  `$ ez-ssh pi`        
    
    
**3. Remote**      

*Input:*  `$ ez-ssh drop -a 203.0.113.0 -u root -r`    

*Result:* `ssh -R 52698:localhost:52698 root@203.0.113.0`

*Usage:*  `$ ez-ssh drop`
    
    
**4. Custom**      

*Input:*  `$ ez-ssh lister -c "penguin.example.net ls /usr/share/doc"`

*Result:* `ssh penguin.example.net ls /usr/share/doc`  

*Usage:*  `$ ez-ssh lister`      
    
    
**5. Delete**      

*Input:*  `$ ez-ssh lister -d` 

*Result:* The "lister" alias has been deleted.       

## Compatibility

Node >= 7.10, Terminal, iTerm

## License

Copyright &copy; 2018 Robert Reed under [MIT](https://spdx.org/licenses/MIT#licenseText). Feel free to modify or use as you please.

## Acknowledgements

This package uses a bash script that has been modified from the [ttab npm package](https://www.npmjs.com/package/ttab), written by [Michael Klement](mklement0@gmail.com). Thanks for the great example, Michael!

## Contact

[Email](robert.mc.reed@gmail.com), [GitHub](https://github.com/RobertMcReed), [LinkedIn](https://www.linkedin.com/in/robertmcreed/)
