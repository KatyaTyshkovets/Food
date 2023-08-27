import { Inter } from 'next/font/google';
import { Configuration, OpenAIApi } from 'openai';
import { useState } from 'react';
import KEY from '../../env';
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    // const configuration = new Configuration({
    //   apiKey: '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',
    // });
    // const openai = new OpenAIApi(configuration);
    // setLoading(true);

    // setResponses(prevResponses => [...prevResponses, prompt]);

    // const response = await openai.createCompletion({
    //   model: 'text-davinci-003',
    //   prompt: prompt,
    //   temperature: 0.7,
    //   max_tokens: 512,
    // });
    // setPrompt('');
    // setLoading(false);
    // setResponses(prevResponses => [
    //   ...prevResponses,
    //   response.data.choices[0].text,
    // ]);

    let options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
          {
            role: 'system',
            content:
              "You're a JavaScript developer, so talk like a JavaScript developer",
          },
        ],
      }),
    };
    setLoading(true);
    setResponses(prevResponses => [...prevResponses, prompt]);

    setPrompt('');

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      options,
    );
    const data = await response.json();

    setLoading(false);
    setResponses(prevResponses => [
      ...prevResponses,
      data.choices[0].message.content,
    ]);
  };

  return (
    <main>
      <div className="container mx-auto flex justify-center">
        <div className="w-1/3 mt-20">
          <h2 className="text-5xl text-center text-red mb-5">MY CHAT APP</h2>

          <div className="border-b rounded-md">
            <div className="border-b p-6">
              <p className="text-md text-red text-center">
                Your chat history goes here:
              </p>
            </div>
            <div className="border-b p-6">
              {responses &&
                responses.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-zing-800 p-2 rounded-md mb-3"
                    >
                      <span className="text-green text-xs mr-2">
                        [{index + 1}]
                      </span>
                      <p className="text-red text-sm"> {item}</p>
                    </div>
                  );
                })}

              {loading && (
                <p className="text-red text-md text-center">Loading ...</p>
              )}
            </div>
            <div className="border-t p-6 flex">
              <input
                onChange={e => {
                  setPrompt(e.target.value);
                }}
                value={prompt}
                type="text"
                className="w-8/12 bg-zinc-600 px-4 py-2 rounded-tl-md rounded-bl-md text-red"
                placeholder="Your message goes here"
              />
              <button
                onClick={() => {
                  sendMessage();
                }}
                type="button"
                className="w-4/12 bg-zinc-700 text-red rounded-tr-md rounded-br-md"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
