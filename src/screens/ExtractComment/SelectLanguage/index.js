import cn from 'classnames';
import { useForm, FormProvider } from 'react-hook-form';
import { RHFDropdown } from "../../../components";
import useQueryString from "../../../hooks/useQueryString";
import { useMemo } from "react";

const languageFields = [
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/content/ic_language_vn.svg"/>&nbsp; <span class="text-nowrap">Vietnam (VI)</span>`,
        value: 'vi',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/content/ic_language_en.png"/>&nbsp; <span class="text-nowrap">Global English (EN)</span>`,
        value: 'en',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/Australia%20(AU).png"/>&nbsp; <span class="text-nowrap">Australian (EN AU)</span>`,
        value: 'en_au',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/England%20(GB-ENG).png"/>&nbsp; <span class="text-nowrap">British English (EN UK)</span>`,
        value: 'en_uk',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/Spain%20(ES).png"/>&nbsp; <span class="text-nowrap">Spanish (ES)</span>`,
        value: 'es',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/France%20(FR).png"/>&nbsp; <span class="text-nowrap">French (FR)</span>`,
        value: 'fr',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/Germany%20(DE).png"/>&nbsp; <span class="text-nowrap">German (DE)</span>`,
        value: 'de',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/Italy%20(IT).png"/>&nbsp; <span class="text-nowrap">Italian (IT)</span>`,
        value: 'it',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/Portugal%20(PT).png"/>&nbsp; <span class="text-nowrap">Portuguese (PT)</span>`,
        value: 'pt',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/Netherlands%20(NL).png"/>&nbsp; <span class="text-nowrap">Dutch (NL)</span>`,
        value: 'nl',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/India%20(IN).png"/>&nbsp; <span class="text-nowrap">Hindi (HI)</span>`,
        value: 'hi',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/Japan%20(JP).png"/>&nbsp; <span class="text-nowrap">Japanese (JA)</span>`,
        value: 'ja',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/China%20(CN).png"/>&nbsp; <span class="text-nowrap">Chinese (ZH)</span>`,
        value: 'zh',
    },
    {
        name: `<img class="logo rounded-circle me-2" style="width: 21px;height: 21px;border: 1px solid #0000002b" src="/images/flags/Finland%20(FI).png"/>&nbsp; <span class="text-nowrap">Finnish (FI)</span>`,
        value: 'fi',
    },
];

export default function SelectLanguage() {
    const { queryString, setQueryString } = useQueryString();
    const { language_code } = queryString;
    const method = useForm({
        defaultValues: {
            language_code: languageFields[0].name,
        },
    });

    const handleSetLanguageCode = (code) => {
        const selected = languageFields.find(s => s?.name === code);
        setQueryString({ ...queryString, language_code: selected?.value })
    }

    const languageDefault = useMemo(() => {
        return (languageFields?.find(s => s?.value === language_code?.trim()))?.name || languageFields[0]?.name
    }, [language_code])

    return (
        <FormProvider {...method}>
            <form action="">
                <RHFDropdown
                    setValueSelected={handleSetLanguageCode}
                    classDropdownHead={'bg-white text-gray fw-bold min-width-250'}
                    className={cn(
                        'rounded-3 text-gray hidden-svg',
                    )}
                    textFrontOfValue={''}
                    defaultValue={languageDefault}
                    name="country"
                    data={languageFields.map((item) => item.name)}
                />
            </form>
        </FormProvider>
    );
}
