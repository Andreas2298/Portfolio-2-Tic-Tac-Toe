
import { ANSI } from "./ansi.mjs";

const ART1 =`
 ______  ____   __     
|      ||    | /  ]    
|      | |  | /  /     
|_|  |_| |  |/  /       
  |  |     /   \\_      
  |  |    \\     |        
__|  |_____\\____| `    

const ART2 = `
 ______   ____    __   
|      | /    |  /  ]  
|      ||  o  | /  /   
|_|  |_||     |/  /   
  |  |  |  _  /   \\_  
  |  |  |  |  \\     | 
  |__|  |__|__|\\____|
`
const ART3 = `
 ______   ___     ___
|      | /   \\   /  _]
|      ||     | /  [_
|_|  |_||  O  ||    _]
  |  |  |     ||   [_
  |  |  |     ||     | 
  |__|  \\___/ |_____|
`
function showSplashScreen() {
    console.log(ANSI.COLOR.RED+ART1 + ANSI.COLOR.BLUE + ART2 + ANSI.COLOR.GREEN + ART3);
    
}

export default showSplashScreen;
