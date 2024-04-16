from langchain_community.llms import GPT4All
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

# There are many CallbackHandlers supported, such as
# from langchain.callbacks.streamlit import StreamlitCallbackHandler

callbacks = [StreamingStdOutCallbackHandler()]
model = GPT4All(model="./models/ggml-gpt4all-j-v1.3-groovy.bin", n_threads=4)

# Generate text. Tokens are streamed through the callback manager.
model("HI HOW ARE YOU? ", callbacks=callbacks)