class myjumpyclass{
    constructor(){
        document.getElementById('game').innerHTML=""
        this.symbols=['skocko','tref','pik','srce','karo','zvezda'];
        this.current_row=0;
        this.current_column=0;
        this.image_exact='url("./images/exact.png")';
        this.image_notexact='url("./images/notexact.png")'
        this.max_column=4;
        this.max_row=7;
        this.test=[]
        this.init_game()
        this.generate_combination()
        this.generate_fields_per_row();
        this.add_commands();
    }


    init_game(){
        var div=document.createElement('div')
        div.textContent='Attempts:'
        div.style.marginBottom='5px'
        document.getElementById('game').appendChild(div)
        div=document.createElement('div')
        div.id='attempts'
        document.getElementById('game').appendChild(div) 
    }


    //forming combination to be solved
    generate_combination(){
        this.solution=[]
        for (let i=0;i<this.max_column;i++){
            var idx=parseInt(Math.random()*this.symbols.length)
            this.solution.push(this.symbols[idx])
        }
        //console.log(this.solution)
    }

    add_interactivity(element){
        element.style.cursor='pointer';//changes cursors
        element.setAttribute("onclick", "window.myglobal_a.main_method(className)")//adds command
        element.setAttribute("onmouseover", "window.myglobal_a.mark_symbol(id)")//changes borders
        element.setAttribute("onmouseout", "window.myglobal_a.demark_symbol(id)")//changes borders
    }

    //adding command and visual change after game starts
    add_commands(){
        for (var item of this.symbols){
            var element = document.getElementById(item+'_command')
            this.add_interactivity(element)
        }
    }

    //visual change of symbols
    mark_symbol(id){
        //var row=parseInt(this.divide_string(id,'_')[0])
        document.getElementById(id).style.borderWidth='2px';
        document.getElementById(id).style.borderColor='red';
        //compensation for the boder change so that solution fields do not move
        //if (!isNaN(row)){
        //document.getElementById(row+'empty').style.width='28px'
        //}
    }
    demark_symbol(id){
        //var row=parseInt(this.divide_string(id,'_')[0])
        document.getElementById(id).style.borderWidth='1px';
        document.getElementById(id).style.borderColor='black';
        //compensation for the boder change so that solution fields do not move
        //if (!isNaN(row)){
        //    document.getElementById(row+'empty').style.width='30px'
        //}
    }

    //to extract test combination from class names and row number from id
    divide_string(string,sep){
        var index_start=[];
        var index_end=[];
        index_start.push(0)
        for (let i=0;i<string.length;i++){
            if (string.charAt(i)==sep){
                index_end.push(i)
                index_start.push(i+1)
            }
        };
        index_end.push(string.length);
        var words=[];
        for (let i=0;i<index_start.length;i++){
            words.push(string.substring(index_start[i],index_end[i]))
        }
        return words
    }
    //to put alert to sleep
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
     }

    //MAIN 
    main_method(className){
        this.test.push(this.divide_string(className,' ')[1])//forming test
        var element = document.getElementById(this.current_row+'_'+this.current_column)
        element.setAttribute('class',className)//gives background image
        this.add_interactivity(element)//now we can click on the fields in the attempts
        this.current_column++
        if (!(this.current_column % this.max_column)){
            let result=this.check_solution()
            this.show_solution(result[0], result[1])
            if (result[0]==4){
                //putting alert to sleep
                this.sleep(200).then(() => {
                    if (!alert('You got it right!')){window.location.reload()}//there is an issue with alert in current version of firefox
                    })
                
            }else{
            this.current_column=this.current_column % this.max_column
            this.current_row++
            this.generate_fields_per_row()
                if (this.current_row==this.max_row){
                    this.show_final_solution();
                    //putting alert to sleep
                    this.sleep(200).then(() => {
                        if (!alert('You have run out of attempts!')){window.location.reload()}//there is an issue with alert in current version of firefox
                        })
                    
                }
            }
            this.test=[]
        }
    }

    show_final_solution(){
        for (let ii=0;ii<this.max_column;ii++){
            document.getElementById(this.current_row+'_'+ii).setAttribute('class','field '+this.solution[ii])
            document.getElementById(this.current_row+'_'+ii).style.borderColor='red';
        }

    }

    show_solution(exact,notexact){
        this.generate_solution_fields();
        let ii=0
        while (exact>0){
            document.getElementById('s'+this.current_row+'_'+ii).style.backgroundImage=this.image_exact;
            document.getElementById('s'+this.current_row+'_'+ii).style.backgroundSize='100%'
            exact--
            ii++
        }
        while (notexact>0){
            document.getElementById('s'+this.current_row+'_'+ii).style.backgroundImage=this.image_notexact;
            document.getElementById('s'+this.current_row+'_'+ii).style.backgroundSize='100%'
            notexact--
            ii++
        } 
    }

    //it has to be with deep copy because it is only passing a reference to an array
    check_solution(){
        var solution=[]
        //deep copy
        for (var item of this.solution){
            solution.push(item)
        }
        var exact=0
        var notexact=0
        //first find exact solutions and eliminate them
        for (let i=0;i<this.test.length;i++){
            if (this.test[i]==solution[i]){
                solution[i]=0
                this.test[i]=-1
                exact++
            }
        }
        //find solutions not in place and eliminate them
        for (let i=0;i<this.test.length;i++){
            for (let jj=0;jj<solution.length;jj++){
                if (solution[jj]==this.test[i]){
                    notexact++
                    solution[jj]=0
                    this.test[i]=-1
                } 
            }
        }
        return [exact, notexact]
    }


    generate_fields_per_row(){
        var div = document.createElement("div");
        div.className = 'row';
        div.id=this.current_row;
        document.getElementById('attempts').appendChild(div);
        for (var ii=0;ii<this.max_column;ii++){
            div = document.createElement("div");
            div.className = 'field';
            div.id=this.current_row+'_'+ii;
            document.getElementById(this.current_row).appendChild(div);
        }
        //generates empty space after attempt fields empty space is used to compensate for the border change and to give better look
        div = document.createElement("div");
        div.className = 'field';
        div.id=this.current_row+'empty'
        div.style.borderColor='white';
        document.getElementById(this.current_row).appendChild(div);
    }
    //this comes after empty field
    generate_solution_fields(){
        for (var ii=0;ii<this.max_column;ii++){
            let div = document.createElement("div");
            div.className = 'field';
            div.id='s'+this.current_row+'_'+ii;
            document.getElementById(this.current_row).appendChild(div);
        }
    }

}