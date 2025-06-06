class SceneManager {
    private sceneQueue: { key: string; data?: any }[] = [];

    pushScene(key: string, data?: any) {
        this.sceneQueue.push({ key, data });
    }

    getNextScene() {
        console.log('Scenes left:' + this.sceneQueue.map(scene => scene.key).join(", "));
        console.log("Switching scene to: " + this.sceneQueue.at(0)?.key);
        if(this.hasNextScene()){
            return this.sceneQueue.shift(); // Nimmt das erste Element und entfernt es aus der Warteschlange
        }else{
            return { key : 'MainMenu', data: null };
        }
        
    }

    hasNextScene() {
        return this.sceneQueue.length > 0;
    }
}

export const sceneManager = new SceneManager();