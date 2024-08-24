from huggingface_hub import hf_hub_download
import os

def download_model(repo_id, filename, local_dir):
    
    if not os.path.exists(local_dir): # 저장하고자 하는 폴더가 실제로 있는지 확인
        os.makedirs(local_dir) # 없으면 생성
    
   
    model_path = hf_hub_download(repo_id=repo_id, filename=filename, local_dir=local_dir)  # huggingface_hub 에서 다운 
    print(f"Model downloaded to: {model_path}") 

if __name__ == "__main__":
    
    repo_id = "MLP-KTLim/llama-3-Korean-Bllossom-8B-gguf-Q4_K_M" # 다운 받고자 하는 모델
    filename = "llama-3-Korean-Bllossom-8B-Q4_K_M.gguf" # 저장할 때의 파일 명 
    local_dir = "./mlp_llama_model"  # 저장 폴더 

    
    download_model(repo_id, filename, local_dir)
